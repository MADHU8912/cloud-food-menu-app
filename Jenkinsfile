pipeline {
    agent any

    environment {
        IMAGE = "nikhilabba12/cloud-food-menu-app:latest"
    }

    stages {

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | /usr/local/bin/docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Docker Build') {
            steps {
                sh '/usr/local/bin/docker build -t $IMAGE .'
            }
        }

        stage('Docker Push') {
            steps {
                sh '/usr/local/bin/docker push $IMAGE'
            }
        }

        stage('Deploy to Render') {
            steps {
                sh '''
                curl -X POST https://api.render.com/deploy/YOUR_SERVICE_ID
                '''
            }
        }
    }
}