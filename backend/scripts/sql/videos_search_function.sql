/*COMPLETED BY: Bethany Cooper */
SELECT DISTINCT videos.videoid, channelid, channelname, title, description, averagerating, viewcount, uploaddate,
                keywords, category, values, tn.max_height,
                max_approxdurationms, fm.max_height, difference(lower(title), '${query}')
                FROM videos
    INNER JOIN
    (
            SELECT	videoid,
                    url,
                    MAX(height) OVER (PARTITION BY videoid) AS max_height
            FROM thumbnails
    ) tn ON videos.videoid = tn.videoid
    INNER JOIN
    (
            SELECT videoid,
                   MAX(approxdurationms) OVER (PARTITION BY videoid) AS max_approxdurationms,
                    MAX(height) OVER (PARTITION BY videoid) AS max_height
            FROM formats
        ) fm ON tn.videoid = fm.videoid
    WHERE difference(lower(title), '${query}') > 2
    ORDER BY difference(lower(title), '${query}') DESC;
