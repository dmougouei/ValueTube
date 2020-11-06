/*COMPLETED BY: Bethany Cooper */
-- SELECT ALL VIDEOS EXCLUDING ALL WITH 0 VALUE FOR USER
SELECT * FROM videos
WHERE ((values).power = 1 OR (values).tradition = 1 OR (values).hedonism = 1 OR (values).achievement = 1 OR (values).conformity = 1) and ((values).benevolence = 0 AND (values).universalism = 0 AND (values).self_direction = 0 AND (values).security = 0);

-- SELECT ALL VIDEOS WITH ONLY MAJOR 0 VALUES FOR USER EXCLUDED
SELECT * FROM videos
WHERE ((values).power = 1 OR (values).tradition = 1 OR (values).hedonism = 1 OR (values).achievement = 1 OR (values).conformity = 1) and ((values).benevolence = 0 AND (values).universalism = 0);

-- SELECT ALL MY VALUES AND NOT NOT MY VALUES
SELECT * FROM videos
WHERE ((values).achievement = 1 OR (values).benevolence = 1 OR (values).power = 1 OR (values).security = 1 OR (values).self_direction = 1 OR (values).universalism = 1) AND ((values).conformity = 0 AND (values).hedonism = 0 AND (values).tradition = 0 AND (values).stimulation = 0);

-- SELECT ALL PRIORITIZING MAIN VALUES FIRST
SELECT * FROM videos
WHERE  ((values).self_direction = 1 AND (values).achievement = 1) OR ((values).benevolence = 1 AND (values).power = 1 AND (values).security = 1 AND (values).universalism = 1) AND ((values).conformity = 0 AND (values).hedonism = 0 AND (values).tradition = 0 AND (values).stimulation = 0);

/* best implementing a script in python to do this, can be called from site kind of like rest api? */

