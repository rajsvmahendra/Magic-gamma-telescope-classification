import os
import sys
import logging
from typing import Optional
from pyspark.sql import SparkSession

logger = logging.getLogger("magic_gamma_explorer.spark")

_spark_session: Optional[SparkSession] = None

def get_spark_session() -> SparkSession:
    """
    Returns the active singleton SparkSession, creating one if not yet initialized.
    Configured for local execution reusing the active Python environment.
    """
    global _spark_session
    if _spark_session is None or _spark_session._jsc is None:
        # Align PySpark worker with the current Python runtime
        current_python = sys.executable
        os.environ["PYSPARK_PYTHON"] = current_python
        os.environ["PYSPARK_DRIVER_PYTHON"] = current_python

        logger.info("Initializing singleton PySpark session...")
        _spark_session = (
            SparkSession.builder
            .appName("MAGIC-Gamma-Explorer-Backend")
            .master("local[*]")
            .config("spark.ui.enabled", "false")
            .config("spark.driver.memory", "2g")
            .config("spark.sql.shuffle.partitions", "4")
            .getOrCreate()
        )
        logger.info("SparkSession initialized successfully. Spark version: %s", _spark_session.version)
    return _spark_session

def stop_spark_session() -> None:
    """
    Gracefully stops the singleton SparkSession if active.
    """
    global _spark_session
    if _spark_session is not None:
        logger.info("Stopping singleton PySpark session...")
        try:
            _spark_session.stop()
        except Exception as e:
            logger.warning("Error stopping SparkSession: %s", e)
        finally:
            _spark_session = None
        logger.info("SparkSession stopped.")
