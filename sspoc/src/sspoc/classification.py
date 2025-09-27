"""Classification functions."""

import numpy as np


def classify_nearest_centroid(X: np.ndarray, Phi: np.ndarray, w: np.ndarray, centroid: np.ndarray) -> np.ndarray:
    """
    Nearest-centroid classifier.

    Parameters
    ----------
    X : np.ndarray
        Raw data to be classified, n by m matrix where m is number of observations
        of n-dimensional vectors.
    Phi : np.ndarray
        Measurement matrix, q by n. If full n-dimensional states are to be used,
        set Phi = eye(n).
    w : np.ndarray
        Trained discrimination vectors from LDA.
    centroid : np.ndarray
        Centroid of each class in w space, (c-1) by c matrix.

    Returns
    -------
    np.ndarray
        Class labels for each observation, 1 by m vector.
    """
    # Project data into classifier space
    X_cls = w.T @ (Phi @ X)

    # Classify each sample by finding nearest centroid
    cls = np.zeros(X_cls.shape[1], dtype=int)

    for i in range(X_cls.shape[1]):
        # Compute Euclidean distance to each centroid
        diff = centroid - X_cls[:, i:i+1]
        distances = np.sqrt(np.sum(diff**2, axis=0))

        # Find closest centroid (class starts from 1, not 0)
        cls[i] = np.argmin(distances) + 1

    return cls