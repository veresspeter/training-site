package hu.redriver.web.utils.agora.rtm;

import hu.redriver.web.utils.agora.media.AccessToken;

public class RtmTokenBuilder {
    public enum Role {
        Rtm_User(1);

        int value;
        Role(int value) {
            this.value = value;
        }
    }

    public AccessToken mTokenCreator;

    public String buildToken(String appId, String appCertificate, String channelName, String uid, Role role, int privilegeTs) throws Exception {
        mTokenCreator = new AccessToken(appId, appCertificate, channelName, uid);
        mTokenCreator.addPrivilege(AccessToken.Privileges.kRtmLogin, privilegeTs);
        mTokenCreator.addPrivilege(AccessToken.Privileges.kJoinChannel, privilegeTs);
        mTokenCreator.addPrivilege(AccessToken.Privileges.kPublishAudioStream, privilegeTs);
        mTokenCreator.addPrivilege(AccessToken.Privileges.kPublishVideoStream, privilegeTs);
        return mTokenCreator.build();
    }

    public void setPrivilege(AccessToken.Privileges privilege, int expireTs) {
        mTokenCreator.addPrivilege(privilege, expireTs);
    }

    public boolean initTokenBuilder(String originToken) {
        mTokenCreator.fromString(originToken);
        return true;
    }
}
