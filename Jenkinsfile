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
        docker 'openjdk:8-jre'
      }
      steps {
        sh 'chmod go-w -R .'
        sh './mvnw package -Pdev verify jib:build'
      }
    }

  }
}