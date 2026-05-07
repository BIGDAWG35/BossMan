# Python Learning

## Overview
Python programming - from basics to advanced projects.

---

## Video Tutorials

### Project-Based Channels
- **freeCodeCamp**: youtube.com/@freecodecamp
  - Full project tutorials
  - Web development, data science, automation
  
- **Corey Schafer**: youtube.com/@coreyms
  - Python tutorials
  - Django, Flask
  - Best practices

### Other Great Channels
- **Sentdex**: pythonprogramming.net
- **Tech With Tim**: youtube.com/@TechWithTim
- **Python Engineer**: youtube.com/@PythonEngineer

---

## PyPA - Python Packaging

### Python Packaging Authority
- **PyPA**: pypa.io/
- **Python Packaging Guide**: packaging.python.org/

### Key Resources
- **pip**: pypa.io/en/latest/
- **virtualenv**: virtualenv.pypa.io/
- **Poetry**: python-poetry.org/
- **PyInstaller**: pyinstaller.org/

---

## PEPs - Python Enhancement Proposals

### Important PEPs
- **PEP 8**: Style Guide for Python Code
- **PEP 20**: The Zen of Python
- **PEP 257**: Docstring Conventions
- **PEP 484**: Type Hints

### Where to Find
- **PEPs Index**: peps.python.org/
- **PEP 8**: peps.python.org/pep-0008/
- **PEP 20**: peps.python.org/pep-0020/

---

## Package Development

### structure
```
my_package/
├── src/
│   └── my_package/
│       ├── __init__.py
│       └── module.py
├── tests/
├── pyproject.toml
├── README.md
└── LICENSE
```

### pyproject.toml
```toml
[build-system]
requires = ["setuptools>=61.0"]
build-backend = "setuptools.build_meta"

[project]
name = "my-package"
version = "0.1.0"
dependencies = ["requests"]

[tool.pytest.ini_options]
testpaths = ["tests"]
```

---

## Virtual Environments

### venv (Built-in)
```bash
# Create
python -m venv venv

# Activate
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Install
pip install package

# Deactivate
deactivate
```

### Poetry
```bash
# Install
pip install poetry

# New project
poetry new my-project

# Add dependency
poetry add requests

# Install
poetry install

# Build
poetry build
```

---

## Best Practices

### Code Style
- Follow PEP 8
- Use type hints
- Write docstrings
- Keep functions small

### Testing
- pytest for testing
- unittest module
- Coverage tools

### Documentation
- README.md
- Docstrings
- Type hints

---

## Python Certification Resources (PCEP/PCAP/PCPP)

### Official
- **Python Institute**: pythoninstitute.org/
- **PEP Index**: peps.python.org/
- **Python.org Docs**: docs.python.org/3/

### Books
- **Python Crash Course** - Eric Matthes (Project-based)
- **Fluent Python** - Luciano Ramalho (Deep dive)
- **Automate the Boring Stuff** - Al Sweigart (Real-world tasks)
- **Python Testing with pytest** - Brian Okken

### Practice Platforms
- **LeetCode**: leetcode.com/
- **HackerRank**: hackerrank.com/
- **PyBites**: pybites.com/

### Learning Plan
1. Python Institute - syllabus outline
2. Read Python Crash Course + watch Corey Schafer
3. Practice with PyBites/LeetCode
4. Build a real project:
   - Create CLI tool
   - Set up venv
   - Package with pyproject.toml

---

## Practice Platforms

### Coding Challenges
- **LeetCode**: leetcode.com/
  - Easy to Hard problems
  - Python solutions
  
- **HackerRank**: hackerrank.com/
  - Python practice
  - Algorithms, data structures

### More Practice
- **Codewars**: codewars.com/
- **Exercism**: exercism.org/tracks/python
- **PyBites**: pybites.com/

---

## Python Project Ideas

### Automation
- File organization scripts
- Web scraping
- Email automation
- API integrations

### DevOps
- CI/CD scripts
- Deployment automation
- Log parsing
- Monitoring scripts

### Web
- Flask/Django apps
- REST APIs
- Web scraping

### Data
- Data analysis (pandas)
- Automation reports
- CSV/Excel processing

---

## GitHub Search Queries
- python automation projects
- devops with python
- python scripts
- awesome python

---

## Python for IT Automation

### Core Python
- **Python Docs**: docs.python.org/3/
- **PyPI**: pypi.org/
- **Real Python**: realpython.com/
- **Automate the Boring Stuff**: automatetheboringstuff.com/

### Linux
- **TLDP**: tldp.org/
- **Ubuntu Docs**: help.ubuntu.com/
- **Debian Admin Handbook**: debian-handbook.info/

### Systemd
- **Systemd.io**: systemd.io/
- **Arch Linux Wiki**: wiki.archlinux.org/title/Systemd

---

## Configuration Management

### Tools
- **Ansible**: docs.ansible.com/
- **Terraform**: terraform.io/docs
- **HashiCorp Learn**: learn.hashicorp.com/
- **Puppet**: puppet.com/docs
- **Chef**: docs.chef.io/

---

## Scripting for Sysadmin

### Bash & Text Processing
- **Bash Reference**: tiswww.case.edu/php/chet/readline/bash/
- **awk**: gnu.org/software/gawk/
- **sed**: gnu.org/software/sed/
- **RegEx**: regular-expressions.info/

### Networking
- **Ubuntu Netplan**: ubuntu.com/server/docs/network-configuration
- **iptables/nftables**: wiki.nftables.org/
- **SSH**: openssh.com/faq.html

---

## Cloud Automation

### Providers
- **AWS Docs**: docs.aws.amazon.com/
- **Google Cloud**: cloud.google.com/docs
- **Azure Docs**: docs.microsoft.com/azure/

---

## Data & APIs

### Python Libraries
- **Requests**: requests.readthedocs.io/
- **JSON**: docs.python.org/3/library/json.html
- **PyYAML**: pyyaml.org/
- **pandas**: pandas.pydata.org/docs/

### CSV/Excel
- **CSV**: docs.python.org/3/library/csv.html
- **pandas Excel**: pandas.pydata.org/docs/

---

## Logging & Monitoring

### Python Logging
- **Logging Module**: docs.python.org/3/library/logging.html

### Monitoring
- **Prometheus**: prometheus.io/docs/
- **Grafana**: grafana.com/docs/

---

## Version Control

### Git
- **Git Docs**: git-scm.com/docs
- **GitHub Docs**: docs.github.com/

---

## Practice Platforms

### Hands-On
- **Google Cloud Training**
- **Katacoda**: katacoda.com/
- **Qwiklabs**: qwiklabs.com/

---

## Web Development (NEW Resources)

### Accessibility
- **A11y Project**: a11yproject.com/
  - Practical checklists
  - Real-world examples

### Performance
- **Web Almanac**: almanac.httparchive.org/
  - Real-world web data
  - Performance benchmarks

### Practice
- **JavaScript30**: javascript30.com/
  - 30 vanilla JS projects
  - Practical challenges
