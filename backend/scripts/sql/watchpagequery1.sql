CREATE FUNCTION watchPageQuery1()
RETURNS TABLE (
    vid_videoid text,
    vid_channelid     text,
    vid_channelname   text,
    vid_title         text,
    vid_description   text,
    vid_averagerating text,
    vid_viewcount     unint,
    vid_uploaddate    timestamp,
    vid_keywords      text[],
    vid_category      text,
    vid_values        values_matrix,
    vid_thumbnail_url text,
    duration text,
    popularity float) AS
$Body$
    BEGIN
        RETURN QUERY
      SELECT * FROM (
        SELECT * FROM (
            SELECT DISTINCT ON (videos.videoid) videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
            keywords, category, values, tn.thumbnail,
            fm.duration, (videos.averagerating::FLOAT * videos.viewcount::FLOAT) AS popularity
            FROM videos
            INNER JOIN
            (
                SELECT videoid,
                        url AS thumbnail,
                        MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM thumbnails
            ) tn ON videos.videoid = tn.videoid
            INNER JOIN
            (
                SELECT videoid,
                    MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                        MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM formats
            ) fm ON tn.videoid = fm.videoid
            ORDER BY videos.videoid DESC
        ) AS sortedVideos
        ORDER BY popularity DESC
        LIMIT 50
    ) AS topVideos
    ORDER BY RANDOM()
    LIMIT 12;
END;
$Body$
LANGUAGE plpgsql;
