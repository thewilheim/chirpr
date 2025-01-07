CREATE OR REPLACE FUNCTION update_follow_counts()
    RETURNS TRIGGER AS
$$
BEGIN
    -- Increment the follower count for the followed user
    UPDATE "Users"
    SET "NumberOfFollowers" = "NumberOfFollowers" + 1
    WHERE id = NEW."followedId";

    -- Increment the followee count for the follower user
    UPDATE "Users"
    SET "NumberOfFollowing" = "NumberOfFollowing" + 1
    WHERE id = NEW."followerId";

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_follow_counts
    AFTER INSERT ON "Followers"
    FOR EACH ROW
EXECUTE FUNCTION update_follow_counts();




CREATE OR REPLACE FUNCTION unfollow_counts()
    RETURNS TRIGGER AS
$$
BEGIN
    -- Increment the follower count for the followed user
    UPDATE "Users"
    SET "NumberOfFollowers" = "NumberOfFollowers" - 1
    WHERE id = NEW."followedId";

    -- Increment the followee count for the follower user
    UPDATE "Users"
    SET "NumberOfFollowing" = "NumberOfFollowing" - 1
    WHERE id = NEW."followerId";

    RETURN NEW;
END;
$$
    LANGUAGE plpgsql;

CREATE TRIGGER trigger_unfollow_counts
    AFTER DELETE ON "Followers"
    FOR EACH ROW
EXECUTE FUNCTION unfollow_counts();