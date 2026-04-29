pipeline {
    agent any

    environment {
        IMAGE = "nikhilabba12/cloud-food-menu-app:latest"
    }

    stages {

        // ✅ LOGIN FIRST (IMPORTANT)
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
        sh '/usr/local/bin/docker build -t nikhilabba12/cloud-food-menu-app:latest .'
    }
}
stage('Docker Push') {
    steps {
        sh '/usr/local/bin/docker push nikhilabba12/cloud-food-menu-app:latest'
    }
}
stage('Docker Pull') {
    steps {
        sh '/usr/local/bin/docker pull nikhilabba12/cloud-food-menu-app:latest'
    }
}
stage('Deploy to Render') {
    steps {
        sh '''
        curl -X POST https://api.render.com/deploy/YOUR_SERVICE_ID
        '''
    }
}