"""Sparse Sensor Placement Optimization for Classification (SSPOC)."""

import numpy as np
import cvxpy as cp


def sspoc(Psi: np.ndarray, w: np.ndarray, lambda_: float = 0.0, epsilon: float = 1e-10) -> np.ndarray:
    """
    Sparse Sensor Placement Optimization for Classification.

    Parameters
    ----------
    Psi : np.ndarray
        Feature space, n by r matrix where n is number of measurements,
        r is number of features (e.g., from SVD of original data).
    w : np.ndarray
        Subspace in Psi that we want to reconstruct, r by c matrix where
        r must match Psi, c is the number of clusters minus 1
        (dimensionality of decision space).
    lambda_ : float, optional
        Coupling term between w vectors. If lambda_ = 0 (default),
        there is no coupling. If lambda_ > 0, there is increasing overlap
        between sparse solutions s that recover w.
        Can be tuned between 0.1 and 100 on log scale.
    epsilon : float, optional
        Error tolerance for reconstruction.

    Returns
    -------
    np.ndarray
        Sparse vector in space of the data. Non-zero entries correspond
        to sparse sensor locations.

    Notes
    -----
    Solves Psi'*s = w using l1 norm to promote sparsity.
    """
    n, r = Psi.shape
    c = w.shape[1]

    # Define optimization variable
    s = cp.Variable((n, c))

    # Define objective: minimize l1 norm + coupling term
    unit = np.ones(c)
    objective = cp.Minimize(cp.norm(s, 1) + lambda_ * cp.norm(s @ unit, 1))

    # Define constraint: reconstruction error
    constraint = [cp.norm(Psi.T @ s - w, 'fro') <= epsilon]

    # Solve optimization problem
    problem = cp.Problem(objective, constraint)
    problem.solve(solver=cp.SCS, verbose=False)

    return s.value