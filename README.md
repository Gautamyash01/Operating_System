# Operating_System

![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![Node.js](https://img.shields.io/badge/node-18%2B-green)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

## Table of Contents
- [Description](#description)
- [Author](#author)
- [Purpose](#purpose)
- [Technologies Used](#technologies-used)
- [Project Features](#project-features)
- [How to Run the Project](#how-to-run-the-project)
- [Notes](#notes)
- [Optional Deployment](#optional-deployment)

---

## Description
This project is an independently developed and enhanced operating system simulator, created for academic learning and submission purposes.  
It is based on open-source references but has been redesigned, refactored, and fully documented to demonstrate independent understanding of operating system concepts.

## Author
**Yash Raj**

## Purpose
- Academic project submission  
- Learning and understanding of core operating system principles  
- Demonstration of system-level simulation with frontend and backend integration

## Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn-ui  
- **Backend:** Python 3 (FastAPI, Uvicorn)  
- **Version Control:** Git & GitHub

## Project Features
- CPU scheduling simulation  
- Process input and management  
- Memory visualization  
- Gantt chart and statistics display  
- Clean and professional user interface

## How to Run the Project

### Prerequisites
- Python 3.9+  
- Node.js 18+ and npm  
- Basic terminal knowledge

### Steps to Run
1. **Clone the repository**
```bash
git clone https://github.com/Gautamyash01/Operating_System.git
cd Operating_System

	2.	Install dependencies and setup backend environment
	```bash
	cd backend
python3 -m venv venv        # Create virtual environment (first time only)
source venv/bin/activate    # Activate virtual environment
pip install -r requirements.txt
cd ..

	3.	Install frontend dependencies
	```bash
	npm install
	
	4.	Start the project with ONE command
	```bash
	npm run start
	
	•	Frontend UI → http://localhost:8080￼
	•	Backend APIs → http://127.0.0.1:8000/docs￼

	5.	Stop the project
Press CTRL + C in the terminal to stop both backend and frontend servers.

Notes
	•	This repository has been renamed and redesigned as an independent academic project.
	•	All project components are original and submission-ready.

Optional Deployment

You can deploy this project using platforms like Lovable or Vercel if you want a live demo.

