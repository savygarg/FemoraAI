# FemoraAI

### An AI-Powered Digital Health Platform for Early Risk Assessment of PCOS, Diabetes & Thyroid Disorders

FemoraAI is an AI-powered digital healthcare platform designed to support the early risk assessment of **Polycystic Ovary Syndrome (PCOS), Diabetes, and Thyroid disorders**. The platform combines full-stack web development, machine learning, health-data management, and conversational AI to provide users with a centralized digital health environment.

The system allows users to securely manage their health information, perform AI-based health assessments, upload and manage blood reports, maintain a health journal, review previous prediction results, and interact with an AI-powered health assistant.

> **Disclaimer:** FemoraAI is intended for educational, awareness, and preliminary risk-assessment purposes. It does not provide medical diagnosis or replace professional medical advice.

---

## Features

### Authentication
- Secure user registration and login
- JWT-based authentication
- Protected user-specific resources

### Health Profile
- Manage personal health information
- Age, height, weight, blood group and other health-related details
- Menstrual and lifestyle information
- Sleep duration tracking

### AI Health Risk Assessment
FemoraAI provides machine-learning-based risk assessment for:

- **PCOS** — XGBoost model
- **Diabetes** — XGBoost model
- **Thyroid Disorders** — Random Forest model

Users can complete health assessments and review their prediction results.

### Blood Report Management
- Upload blood reports
- Store uploaded reports securely
- Extract and display relevant health parameters
- Maintain previously uploaded reports

The system currently handles parameters including:

- Hemoglobin
- Total WBC
- Platelets
- Fasting Blood Glucose
- Vitamin B12
- Vitamin D

### Prediction History
- Store previous AI assessment results
- View historical PCOS, Diabetes, and Thyroid assessments

### Health Journal
- Record daily health-related observations
- Maintain personal lifestyle and health notes
- Review previous journal entries

### AI Health Assistant
- Conversational health assistant powered by the **Groq API**
- Provides general health and preventive-health guidance
- Designed with medical-safety instructions
- Does not provide medical diagnosis

### Dashboard
- Centralized view of health information
- Assessment results
- Blood reports
- Prediction history
- Health journal
- AI health assistance

---

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Multer
- JWT

### Database
- MongoDB Atlas

### AI / Machine Learning
- FastAPI
- Python
- XGBoost
- Random Forest
- Scikit-Learn
- Pandas
- NumPy

### AI Assistant
- Groq API

### Deployment
- Vercel — Frontend
- Render — Backend & AI Service
- MongoDB Atlas — Database

---

## System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ React + Vite        │
                         │ Frontend            │
                         └──────────┬──────────┘
                                    │
                              REST APIs
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Node.js + Express   │
                         │ Backend             │
                         └──────┬───────┬──────┘
                                │       │
                    ┌───────────┘       └──────────────┐
                    ▼                                  ▼
          ┌──────────────────┐               ┌─────────────────┐
          │ MongoDB Atlas    │               │ FastAPI AI      │
          │                  │               │ Service         │
          └──────────────────┘               └────────┬────────┘
                                                      │
                              ┌───────────────────────┼──────────────────────┐
                              ▼                       ▼                      ▼
                       ┌─────────────┐        ┌─────────────┐       ┌─────────────┐
                       │ PCOS        │        │ Diabetes    │       │ Thyroid     │
                       │ XGBoost     │        │ XGBoost     │       │ Random      │
                       │ Model       │        │ Model       │       │ Forest      │
                       └─────────────┘        └─────────────┘       └─────────────┘

                         Node.js Backend
                                │
                                ▼
                         ┌───────────────┐
                         │   Groq API    │
                         │ AI Assistant  │
                         └───────────────┘
