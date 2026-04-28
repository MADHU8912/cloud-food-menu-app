pipeline {
    agent any

    environment {
        IMAGE_NAME = "nikhilabba12/cloud-food-menu-app"
        VERSION = "v1.${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build') {
            steps {
                bat '''
                echo ===== BUILD START =====
                docker build -t %IMAGE_NAME%:%VERSION% .
                echo ===== BUILD COMPLETE =====
                '''
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

        stage('Push Image') {
            steps {
                bat '''
                docker push %IMAGE_NAME%:%VERSION%

                docker tag %IMAGE_NAME%:%VERSION% %IMAGE_NAME%:latest
                docker push %IMAGE_NAME%:latest

                echo Release Version: %VERSION%
                '''
            }
        }

        stage('Docker Pull Test') {
            steps {
                bat "docker pull %IMAGE_NAME%:%VERSION%"
            }
        }

        stage('Start New Container') {
    steps {
        bat '''
        echo ===== CLEAN PORT 8086 =====

        for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8086') do (
            echo Killing process %%a
            taskkill /F /PID %%a || echo No process
        )

        echo ===== REMOVE OLD GREEN =====
        docker stop food-app-green || echo not running
        docker rm food-app-green || echo not exists

        echo ===== START GREEN CONTAINER =====
        docker run -d -p 8086:5000 --name food-app-green %IMAGE_NAME%:%VERSION%

        echo ===== VERIFY CONTAINER =====
        docker ps | findstr food-app-green || exit 1
        '''
    }
}

stage('Container Logs') {
    steps {
        bat '''
        echo ===== CONTAINER LOGS =====
        docker logs food-app-green || echo No logs available
        '''
    }
}

stage('Health Check New') {
    steps {
        bat '''
        echo ===== WAIT FOR APP START =====
        ping 127.0.0.1 -n 20 >nul

        echo ===== HEALTH CHECK (GREEN) =====
        curl http://localhost:8086/api/restaurants

        IF %ERRORLEVEL% NEQ 0 (
            echo Health check failed!
            docker logs food-app-green
            exit /b 1
        )
        '''
    }
}

stage('Switch Traffic') {
    steps {
        bat '''
        echo ===== CLEAN PORT 8085 =====

        for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8085') do (
            echo Killing process %%a
            taskkill /F /PID %%a || echo No process
        )

        echo ===== REMOVE OLD LIVE =====
        docker stop food-app || echo not running
        docker rm food-app || echo not exists

        echo ===== START LIVE CONTAINER =====
        docker run -d -p 8085:5000 --name food-app %IMAGE_NAME%:%VERSION%

        echo ===== VERIFY LIVE =====
        docker ps | findstr food-app || exit 1
        '''
    }
}

stage('Final Health Check') {
    steps {
        bat '''
        echo ===== FINAL HEALTH CHECK =====
        ping 127.0.0.1 -n 10 >nul

        curl http://localhost:8085/api/restaurants

        IF %ERRORLEVEL% NEQ 0 (
            echo Final health check failed!
            docker logs food-app
            exit /b 1
        )
        '''
    }
}