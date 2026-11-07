from pydantic import BaseModel, Field

class HillasFeaturesInput(BaseModel):
    """
    Input schema representing the 10 Hillas parameters extracted from a Cherenkov shower image.
    Ranges are bounded by empirical dataset extremes with small safety margins.
    """
    fLength: float = Field(
        ...,
        description="Major axis of the ellipse [mm]",
        ge=0.0,
        le=500.0,
        examples=[31.6036]
    )
    fWidth: float = Field(
        ...,
        description="Minor axis of the ellipse [mm]",
        ge=0.0,
        le=400.0,
        examples=[11.7235]
    )
    fSize: float = Field(
        ...,
        description="10-log of sum of content of all pixels [in photons]",
        ge=1.0,
        le=7.0,
        examples=[2.5185]
    )
    fConc: float = Field(
        ...,
        description="Ratio of sum of two highest pixels over fSize",
        ge=0.0,
        le=1.0,
        examples=[0.5303]
    )
    fConc1: float = Field(
        ...,
        description="Ratio of highest pixel over fSize",
        ge=0.0,
        le=1.0,
        examples=[0.3773]
    )
    fAsym: float = Field(
        ...,
        description="Distance from highest pixel to center along major axis [mm]",
        ge=-600.0,
        le=700.0,
        examples=[26.2722]
    )
    fM3Long: float = Field(
        ...,
        description="3rd root of third moment along major axis [mm]",
        ge=-500.0,
        le=400.0,
        examples=[23.8238]
    )
    fM3Trans: float = Field(
        ...,
        description="3rd root of third moment along minor axis [mm]",
        ge=-300.0,
        le=300.0,
        examples=[-9.9574]
    )
    fAlpha: float = Field(
        ...,
        description="Angle of major axis with vector to origin [degrees]",
        ge=0.0,
        le=90.0,
        examples=[6.3609]
    )
    fDist: float = Field(
        ...,
        description="Distance from origin to center of ellipse [mm]",
        ge=0.0,
        le=600.0,
        examples=[205.261]
    )

    def to_ordered_list(self) -> list[float]:
        """Returns values in the exact order expected by the VectorAssembler."""
        return [
            self.fLength,
            self.fWidth,
            self.fSize,
            self.fConc,
            self.fConc1,
            self.fAsym,
            self.fM3Long,
            self.fM3Trans,
            self.fAlpha,
            self.fDist
        ]

class PredictionResponse(BaseModel):
    """
    Response schema returning the model classification and class probability distribution.
    """
    model_name: str
    prediction: int = Field(..., description="0 for Gamma, 1 for Hadron")
    class_name: str = Field(..., description="Human-readable class name")
    is_signal: bool = Field(..., description="True if Gamma ray signal, False if Hadron background")
    probability_gamma: float = Field(..., ge=0.0, le=1.0)
    probability_hadron: float = Field(..., ge=0.0, le=1.0)
    confidence: float = Field(..., ge=0.0, le=1.0)
