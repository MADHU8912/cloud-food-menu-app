pipeline {
    agent any

    stages {

        stage('Docker Debug') {
            steps {
                sh 'echo PATH=$PATH'
                sh 'which docker || echo "docker not found"'
                sh 'docker --version || echo "docker failed"'
            }
        }

        stage('Docker Check') {
            steps {
                sh 'docker --version'
            }
        }
    }
}