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
          DB = credentials('postgresql')
      }
      steps {
        sh 'chmod go-w+x -R .'
        sh './mvnw package -Dspring.profiles.active=prod -Djib.to.auth.password=$DOCKERHUB_PSW -Djib.to.auth.username=$DOCKERHUB_USR -DbuildNo=$BUILD_NUMBER verify jib:build'
      }
    }

    stage('Deploy') {
        agent any
        environment {
            KP = credentials('')
        }
        steps {
            withCredentials([sshUserPrivateKey(credentialsId: 'aws-frankfurt-default-kp', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USR')]) {
                sh 'ssh -i $SSH_KEY ${SSH_USR}@maxmove.hu'
            }
        }
    }

  }
}
