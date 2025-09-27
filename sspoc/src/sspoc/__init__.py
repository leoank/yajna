"""Sparse Sensor Placement Optimization for Classification (SSPOC)."""

from .sspoc import sspoc
from .pca_lda import pca_lda
from .lda import lda_n
from .classification import classify_nearest_centroid

__version__ = "0.1.0"
__all__ = ["sspoc", "pca_lda", "lda_n", "classify_nearest_centroid"]