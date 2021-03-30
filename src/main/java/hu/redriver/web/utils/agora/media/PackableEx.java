package hu.redriver.web.utils.agora.media;

public interface PackableEx extends Packable {
    void unmarshal(ByteBuf in);
}
