# Bayesian VAR (BVAR) with Conjugate Priors

https://github.com/pablo-reyes8/bayesian-var/blob/main/README.md

![Repo size](https://img.shields.io/github/repo-size/pablo-reyes8/bayesian-var)
![Last commit](https://img.shields.io/github/last-commit/pablo-reyes8/bayesian-var)
![Open issues](https://img.shields.io/github/issues/pablo-reyes8/bayesian-var)
![Contributors](https://img.shields.io/github/contributors/pablo-reyes8/bayesian-var)
![Forks](https://img.shields.io/github/forks/pablo-reyes8/bayesian-var?style=social)
![Stars](https://img.shields.io/github/stars/pablo-reyes8/bayesian-var?style=social)

A Python implementation of a standard Bayesian Vector Autoregression (VAR) with conjugate Normal–Inverse–Wishart priors and Minnesota hyperparameter structure. This repository provides routines for:

- Specifying and estimating a VAR($p$) model
- Constructing Minnesota priors with five hyperparameters ($\lambda_0$ – $\lambda_5$)
- Sampling from the Normal–Inverse–Wishart posterior
- Computing Monte Carlo impulse response functions (IRFs)
- Performing forecast error variance decomposition (FEVD)

## Table of Contents

- [Project Layout](#project-layout)
- [Data](#data)
- [Quickstart](#quickstart)
- [Results](#results)
- [Convergence Diagnostics](#convergence-diagnostics)
- [API (FastAPI)](#api-fastapi)
- [Features](#features)
- [Contributing](#contributing)
- [License](#license)

## Project Layout

- `data/raw/`: raw source data (Excel)
- `data/processed/`: cleaned/resampled CSVs
- `notebooks/`: exploratory notebooks
- `scripts/`: CLI entrypoints
- `src/bvar/`: package modules (including the FastAPI service)
- `outputs/`: generated model outputs
- `tests/`: pytest suite

## Data

The data used to run the model (to recreate the results) is located at:

- `data/raw/Tes-Bills Final.xlsx`

The code should work with more variables and different types of time series without major complication.

## Quickstart

Install in editable mode:
```bash
pip install -e .
```

Prepare the quarterly data:
```bash
python - <<'PY'
import pandas as pd
df = pd.read_excel('data/raw/Tes-Bills Final.xlsx')
df['Fecha'] = pd.to_datetime(df['Fecha'])
df = df.set_index('Fecha').resample('QE').mean().reset_index()
df[['DGS5','DGS1','TES 5 años']].to_csv('data/processed/tes_bills_quarterly.csv', index=False)
PY
```

Fit the model and draw posterior samples:
```bash
python scripts/bvar_fit.py \
  --data data/processed/tes_bills_quarterly.csv \
  --lags 3 \
  --draws 2000 \
  --output outputs/fit.npz
```

Compute IRFs, FEVD, and plots:
```bash
python scripts/bvar_infer.py \
  --fit outputs/fit.npz \
  --irf-horizon 35 \
  --output-dir outputs \
  --plots-dir outputs/plots
```

Run tests:
```bash
pytest
```

<h2>Results</h2>
<p>Examples of outputs generated using the included data:</p>

<table>
  <tr>
    <td width="50%" align="center">
      <figure>
        <img src="outputs/irfs.png" alt="Impulse Response Functions (IRFs)" style="max-width:100%; height:auto;">
        <figcaption><em>Impulse Response Functions (IRFs)</em></figcaption>
      </figure>
    </td>
    <td width="50%" align="center">
      <figure>
        <img src="outputs/fevd.png" alt="Forecast Error Variance Decomposition (FEVD)" style="max-width:100%; height:auto;">
        <figcaption><em>Forecast Error Variance Decomposition (FEVD)</em></figcaption>
      </figure>
    </td>
  </tr>
  <tr>
    <td width="50%" align="center">
      <figure>
        <img src="outputs/posteriors.png" alt="Posterior densities" style="max-width:100%; height:auto;">
        <figcaption><em>Posterior densities</em></figcaption>
      </figure>
    </td>
    <td width="50%" align="center">
      <figure>
        <img src="outputs/mcmc.png" alt="MCMC trace plots" style="max-width:100%; height:auto;">
        <figcaption><em>MCMC trace plots</em></figcaption>
      </figure>
    </td>
  </tr>
</table>


## Convergence Diagnostics

Run diagnostics from an existing fit:
```bash
python scripts/bvar_diagnostics.py --fit outputs/fit.npz
```

Run diagnostics directly from data (pipeline + at least 2 chains):
```bash
python scripts/bvar_diagnostics.py \
  --data data/processed/tes_bills_quarterly.csv \
  --lags 3 \
  --draws 2000 \
  --chains 2
```

The diagnostics use ArviZ/PyMC to compute R-hat, effective sample sizes (ESS), and a full summary table.

## API (FastAPI)

Start the API:
```bash
uvicorn bvar.api:app --reload --host 0.0.0.0 --port 8000
```

Example request (upload CSV and set `lags`):
```bash
curl -X POST "http://localhost:8000/estimate" \
  -F "file=@data/processed/tes_bills_quarterly.csv" \
  -F "lags=3" \
  -F "draws=2000" \
  -F "irf_horizon=35"
```

## Features

- **Hyperparameter optimization** via marginal likelihood
- **Posterior sampling** of coefficients and covariance draws
- **IRF & FEVD** routines with companion-form and Cholesky factorization
- Flexible handling of lag order $p$ and variable ordering

References:

**J. Jacobo, Una introducción a los métodos de máxima entropía y de inferencia bayesiana en econometría**

## Contributing

Contributions are welcome! Please open issues or submit pull requests at
https://github.com/pablo-reyes8

## License

This project is licensed under the Apache License 2.0.
