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
      withCredentials([usernamePassword(credentialsId: 'dockerhubId', usernameVariable: 'CI_USERNAME', passwordVariable: 'CI_PASSWORD')])
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Pdev -D CI_PASSWORD=$CI_PASSWORD CI_USERNAME=$CI_USERNAME verify jib:build'
      }
    }

  }
}
