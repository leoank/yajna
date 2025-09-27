# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: percent
#       format_version: '1.3'
#       jupytext_version: 1.17.2
#   kernelspec:
#     display_name: Python 3 (ipykernel)
#     language: python
#     name: python3
# ---

# %%
import matplotlib.pyplot as plt
import numpy as np
import scipy
from matplotlib.image import imread

# %% [markdown]
# 1.1 Overview

# %%
X = np.random.rand(5, 3)
X

# %%
U, S, VT = np.linalg.svd(X, full_matrices=True)
Uhat, Shat, VThat = np.linalg.svd(X, full_matrices=False)

# %%
print(f"U: {U} \n S: {S} \n VT: {VT}")

# %%
U[:, :3] @ np.diag(S) @ VT

# %%
print(f"Uhat: {Uhat} \n Shat: {Shat} \n VThat: {VThat}")

# %%
Uhat @ np.diag(S) @ VThat

# %% [markdown]
# Testing singular values


# %%
VT[:1, :]

# %%
S[0] * U[:, :1] @ VT[:1, :]

# %% [markdown]
# # Image compression

# %%
# A = imread("data/ops_seg_sample.png")
X = imread("data/ops_sample.tiff")
# X = np.mean(A, 2)
plt.imshow(X)

# %%
U, S, VT = np.linalg.svd(X, full_matrices=True)
Uhat, Shat, VThat = np.linalg.svd(X, full_matrices=False)

# %%
plt.semilogy(S)

# %%
plt.plot(np.cumsum(S) / np.sum(S))

# %%
S = np.diag(S)

# %%
for r in [10, 100, 200, 300, 400, 500, 600, 700]:
    Xapp = U[:, :r] @ S[0:r, :r] @ VT[:r, :]
    img = plt.imshow(Xapp)
    plt.show()

# %%

# Dimensions of the input image
n = 1000
# number of measurements
p = 200

# \Theta = C \Psi
Theta = np.random.randn(p, n)

# %%
from scipy.fft import fft2, ifft2, dctn, idctn

# %%
X.shape

# %%
Xt = fft2(X)

# %%
Xt

# %%
## Zero out all small coefficients and inverse transform
Xtsort = np.sort(np.abs(np.reshape(Xt,-1)))
keep = 0.05
thresh = Xtsort[int(np.floor((1-keep)*len(Xtsort)))]
ind = np.abs(Xt) > thresh
Xtcompress = Xt * ind
Xcompress = ifft2(Xtcompress)

# %%
Xtcompress

# %%
np.count_nonzero(Xtcompress==0)

# %%
(2432001/ (1600 * 1600)) * 100

# %%
Xtcompress.astype("uint8") == 0

# %%
plt.imshow(Xcompress.astype("float"))

# %%
Xtsort

# %%
thresh

# %%
ind

# %%
np.count_nonzero(ind == 0)

# %%
plt.imshow(Xtcompress.astype("uint8"))

# %%
plt.imshow(X)

# %%
Xtcompress.shape

# %%
