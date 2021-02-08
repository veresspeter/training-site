pipeline {
  agent none
  stages {
    stage('Frontend Build') {
      agent {
        docker 'node:12-alpine'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }

    stage('Backend Build') {
      agent {
        docker 'openjdk:8'
      }
      environment {
          DOCKERHUB = credentials('dockerhubId')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pdev -D CI_PASSWORD=$DOCKERHUB_PSW -D CI_USERNAME=$DOCKERHUB_USR verify jib:build'
      }
    }

  }
}
