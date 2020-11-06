ROLLBACK;
BEGIN;
CREATE TABLE parent_comments (
    commentid             text not null
        constraint parent_comments_pkey
            primary key,
    videoid               text
        constraint parent_comments_fkey
            references videos
            on delete cascade,
   authordisplayname     text,
    authorprofileimageurl text,
    authorchannelurl      text,
    authorchannelid       text,
    channelid             text,
    textdisplay           text,
    textoriginal          text,
    parentid              text,
    canrate               boolean,
    viewerrating          text,
    likecount             unint,
    moderationstatus      text,
    publishedat           timestamp,
    updatedat             timestamp,
    child_comments comment[]
);
INSERT INTO parent_comments SELECT * FROM comments WHERE parentid = '' OR parentid IS NULL;

UPDATE parent_comments
SET child_comments = child_comments ||
                     (SELECT array_agg((commentid, videoid, authordisplayname, authorprofileimageurl,
                                        authorchannelurl, authorchannelid, channelid, textdisplay, textoriginal, parentid,
                                       canrate, viewerrating, likecount, moderationstatus, publishedat, updatedat)::comment)
FROM comments WHERE parent_comments.parentid = comments.parentid);

SELECT * FROM parent_comments;

/*
UPDATE temp_thumbnails
SET thumb_obj = thumb_obj || (SELECT array_agg((thumbnails.videoid::text, thumbnails.url::text, thumbnails.width::int, thumbnails.height::int)::thumbnail)
FROM thumbnails WHERE temp_thumbnails.videoid = thumbnails.videoid);

SELECT * FROM (
                    SELECT DISTINCT ON (videos.videoid) videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
                    keywords, category, values, tn.thumb_obj,
                    fm.duration
                    FROM videos
                    INNER JOIN
                    (
                        SELECT * FROM temp_thumbnails
                    ) tn ON videos.videoid = tn.videoid
                    INNER JOIN
                    (
                        SELECT videoid,
                            MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                                MAX(height) OVER (PARTITION BY videoid) AS max_height
                        FROM formats
                    ) fm ON tn.videoid = fm.videoid
                    ORDER BY videos.videoid DESC
                ) AS sortedVideos;
*/
COMMIT;