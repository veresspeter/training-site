pipeline {
  agent none
  stages {
    /*
    stage('Frontend Build') {
      agent {
        docker 'node:12-alpine'
      }
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    */

    stage('Backend Build') {
      agent {
        docker 'openjdk:8'
      }
      environment {
          DOCKERHUB = credentials('dockerhubId')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pdev -Djib.to.auth.password=$DOCKERHUB_PSW -Djib.to.auth.username=$DOCKERHUB_USR verify jib:build'
      }
    }

  }
}
