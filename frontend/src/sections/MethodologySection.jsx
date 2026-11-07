import React from 'react';
import { Layers, Terminal, ShieldCheck, Database, Cpu, CheckCircle } from 'lucide-react';

export default function MethodologySection() {
  const steps = [
    {
      num: '01',
      title: 'Raw Data Ingestion',
      system: 'spark.read.csv()',
      detail: 'Parses 19,020 simulated air shower records with inferSchema=True and assigns canonical Hillas attribute naming.'
    },
    {
      num: '02',
      title: 'Label Encoding',
      system: 'StringIndexer',
      detail: 'Maps the majority Gamma signal class (12,332) to index 0.0 and Hadron background (6,688) to index 1.0.'
    },
    {
      num: '03',
      title: 'Vector Assembly',
      system: 'VectorAssembler',
      detail: 'Aggregates all 10 continuous Hillas moments into a single dense Spark MLlib vector column [features].'
    },
    {
      num: '04',
      title: 'Holdout Partitioning',
      system: 'randomSplit([0.8, 0.2])',
      detail: 'Isolates 15,278 training events and 3,742 holdout test events with fixed deterministic seed=42.'
    },
    {
      num: '05',
      title: 'Distributed Training',
      system: 'MLlib Classifiers',
      detail: 'Trains RandomForest (100 trees, maxDepth=5) and LogisticRegression (L-BFGS on StandardScaler features).'
    },
    {
      num: '06',
      title: 'Evaluation Metrics',
      system: 'BinaryClassificationEvaluator',
      detail: 'Computes verified test Accuracy (84.07% vs 78.75%), areaUnderROC (0.8869 vs 0.8388), and weighted F1.'
    },
    {
      num: '07',
      title: 'Artifact Persistence',
      system: 'Parquet Serialization',
      detail: 'Serializes trained Spark ML pipeline models and scaling parameters directly into structured Parquet trees.'
    },
    {
      num: '08',
      title: 'FastAPI Service Engine',
      system: 'Uvicorn ASGI (Port 8000)',
      detail: 'Exposes real Spark inference and dataset metadata via asynchronous REST endpoints consumed by this UI.'
    }
  ];

  return (
    <section id="method" className="obs-band obs-band--white">
      <div className="obs-container" style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
        
        {/* Section Header */}
        <div className="obs-section-header">
          <div className="obs-eyebrow">
            <Layers size={13} style={{ color: 'var(--color-primary)' }} />
            <span>09 · HOW IT WAS BUILT</span>
          </div>
          <h2 className="obs-title">The Computational Pipeline.</h2>
          <p className="obs-subtitle">
            The data engineering and machine learning workflow executed in Apache PySpark 3.5.9. Every dataset transformation, model artifact, and evaluation metric shown in this explorer is derived directly from this distributed pipeline.
          </p>
        </div>

        {/* 8-Stage Pipeline Sequence Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px'
          }}
        >
          {steps.map((step) => (
            <div
              key={step.num}
              className="card-base card-lift"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                minHeight: '200px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                    STAGE {step.num}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-muted)' }}>
                    SPARK 3.5.9
                  </span>
                </div>
                <h4 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-ink)', margin: '0 0 4px 0' }}>
                  {step.title}
                </h4>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-primary-pressed)', marginBottom: '8px' }}>
                  {step.system}
                </div>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--color-body-secondary)', lineHeight: 1.5, margin: 0, borderTop: '1px solid var(--color-hairline-trans)', paddingTop: '10px' }}>
                {step.detail}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
