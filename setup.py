from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in fleet_management/__init__.py
from fleet_management import __version__ as version

setup(
	name="fleet_management",
	version=version,
	description="Fleet Management System @AgnikulCosmos",
	author="Agnikul Cosmos",
	author_email="automationbot@agnikul.in",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
