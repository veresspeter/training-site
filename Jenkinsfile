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
        docker 'openjdk:11'
      }
      environment {
          DOCKERHUB = credentials('dockerhubId')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pprod -Djib.to.auth.password=$DOCKERHUB_PSW -Djib.to.auth.username=$DOCKERHUB_USR -DbuildNo=$BUILD_NUMBER verify jib:build'
      }
    }
  }
}
