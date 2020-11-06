CREATE TYPE thumb_short AS (url text, width int);

CREATE FUNCTION homeQuery1(param1 text[])
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
    vid_thumbnail_arr thumb_short[]) AS
$$
    BEGIN
RETURN QUERY
SELECT videoid, channelid, channelname, title, description,
                averagerating, viewcount, uploaddate,
                keywords, category, values, thumbnails::thumb_short[] FROM (
            SELECT DISTINCT ON (videos.videoid) videos.videoid,
                channelid, channelname, title, description,
                averagerating, viewcount, uploaddate,
                keywords, category, values,
                array_agg((thumbnails.url, thumbnails.width)::thumb_short) AS thumbnails,
                fm.duration
            FROM videos
            JOIN thumbnails ON thumbnails.videoid = videos.videoid
            JOIN (
                SELECT videoid,
                    MAX(approxdurationms) OVER (PARTITION BY videoid) AS duration,
                    MAX(height) OVER (PARTITION BY videoid) AS max_height
                FROM formats
            ) fm ON videos.videoid = fm.videoid
            GROUP BY videos.videoid, fm.duration
        ) AS videoData
        WHERE videoData.videoid = ANY(param1::TEXT[]);
END;
$$
LANGUAGE plpgsql;
