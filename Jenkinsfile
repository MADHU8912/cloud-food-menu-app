pipeline {
    agent any

    environment {
        IMAGE_NAME = 'nikhilabba12/cloud-food-menu-app'
        IMAGE_TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Files') {
            steps {
                bat 'dir'
            }
        }

        stage('Docker Build') {
            steps {
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Docker Login') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            bat '''
            docker logout
            docker login -u %DOCKER_USER% -p %DOCKER_PASS%
            '''
        }
    }
}

        stage('Push to Docker Hub') {
            steps {
                bat 'docker push %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat 'docker pull %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Build Report') {
            steps {
                bat 'echo Build Success > build-report.txt'
                archiveArtifacts artifacts: 'build-report.txt', fingerprint: true
            }
        }
    }
}