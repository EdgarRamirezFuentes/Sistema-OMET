import os
import sys
import django

# Obtiene la ruta del directorio raíz de Django
django_path = os.path.abspath('../../')

# Agrega la ruta de importación de Django al sys.path
sys.path.insert(0, django_path)

# Establece la configuración de Django para que pueda ser importada
os.environ['DJANGO_SETTINGS_MODULE'] = 'sistemaOmet.settings'
django.setup()


# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'Sistema Omet'
copyright = '2023, Sistema Omet Team'
author = 'Sistema Omet Team'
release = '1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.autosummary',
    'sphinx.ext.intersphinx',
    'sphinx.ext.viewcode',
]

templates_path = ['_templates']
exclude_patterns = []

language = 'es'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'alabaster'
html_static_path = ['_static']
