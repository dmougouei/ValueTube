CREATE TEMPORARY TABLE temp_thumbnails (
   videoid text,
    thumb_obj thumbnail[]
);
INSERT INTO temp_thumbnails(videoid) SELECT videoid FROM videos;

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
DROP TABLE IF EXISTS temp_thumbnails;


