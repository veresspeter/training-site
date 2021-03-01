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

    stage('Backend Build and Verify') {
      agent {
        docker 'openjdk:11'
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw verify'
      }
    }
  }
}
