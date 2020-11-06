CREATE FUNCTION resultsQuery1(param1 text)
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
    vid_diff int) AS
$$
    BEGIN
RETURN QUERY
SELECT DISTINCT ON (videos.videoid) videos.videoid,
        channelid, channelname,
        title, description,
        averagerating, viewcount,
        uploaddate, keywords,
        category, values, tn.thumbnail,
        fm.duration, difference(lower(title), lower(param1))
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
    WHERE difference(lower(title), lower(param1)) >= 2
    ORDER BY videos.videoid, difference(lower(title), lower(param1)) DESC;
END;
$$
LANGUAGE plpgsql;
