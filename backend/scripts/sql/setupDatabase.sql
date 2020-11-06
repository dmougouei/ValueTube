/*COMPLETED BY: Bethany Cooper */
BEGIN;
CREATE DOMAIN unInt AS BIGINT
   CHECK(VALUE >= 0 AND VALUE < 9223372036854775807);

CREATE TYPE questionOption AS (
	optionValue INTEGER,
	optionText TEXT
);

CREATE TYPE question AS (
	questionId INTEGER,
	questionText TEXT,
	valueAttribute TEXT,
	questionOptions questionOption[],
	internalNotes TEXT
);

CREATE TYPE thumbnail AS (
    videoId TEXT,
    url TEXT,
    width unInt,
    height unInt
);

CREATE TYPE format AS (
    videoId TEXT,
    itag unINT,
    url TEXT,
    mimeType TEXT,
    bitrate unINT,
    width unINT,
    height unINT,
    lastModified TEXT,
    contentLength TEXT,
    quality TEXT,
    fps unINT,
    qualityLabel TEXT,
    projectionType TEXT,
    averageBitrate unINT,
    audioQuality TEXT,
    approxDurationMs TEXT,
    audioSampleRate TEXT,
    audioChannels unINT
);

CREATE TYPE subtitle AS (
    videoId TEXT,
    baseUrl TEXT,
    name TEXT,
    vssId TEXT,
    languageCode TEXT,
    rtl BOOLEAN,
    isTranslatable BOOLEAN
);

CREATE TYPE comment AS (
    commentId TEXT,
    videoId TEXT,
    authorDisplayName TEXT,
    authorProfileImageUrl TEXT,
    authorChannelUrl TEXT,
    authorChannelId TEXT,
    channelId TEXT,
    textDisplay TEXT,
    textOriginal TEXT,
    parentId TEXT,
    canRate BOOLEAN,
    viewerRating TEXT,
    likeCount unINT,
    moderationStatus TEXT,
    publishedAt TIMESTAMP,
    updatedAt TIMESTAMP
);

CREATE TYPE values_matrix AS (
    videoId TEXT,
    self_direction REAL,
    stimulation REAL,
    hedonism REAL,
    achievement REAL,
    power REAL,
    security REAL,
    tradition REAL,
    conformity REAL,
    benevolence REAL,
    universalism REAL
);

CREATE TYPE video AS (
   videoId TEXT,
   channelId TEXT,
   channelName TEXT,
   title TEXT,
   description TEXT,
   averageRating TEXT,
   viewCount unInt,
   uploadDate TIMESTAMP,
   keywords TEXT[],
   category TEXT,
);

CREATE TABLE questions OF question;
ALTER TABLE questions
    ADD CONSTRAINT questions_pkey
    PRIMARY KEY (questionId);

CREATE TABLE videos OF video;
ALTER TABLE videos
    ADD CONSTRAINT videos_pkey
    PRIMARY KEY (videoId);

CREATE TABLE thumbnails OF thumbnail;
ALTER TABLE thumbnails
    ADD CONSTRAINT thumbnails_fkey
    FOREIGN KEY (videoId)
    REFERENCES videos(videoId)
    ON DELETE CASCADE;

CREATE TABLE formats OF format;
ALTER TABLE formats
    ADD CONSTRAINT formats_fkey
    FOREIGN KEY (videoId)
    REFERENCES videos(videoId)
    ON DELETE CASCADE;

CREATE TABLE subtitles OF subtitle;
ALTER TABLE subtitles
    ADD CONSTRAINT subtitles_fkey
    FOREIGN KEY (videoId)
    REFERENCES videos(videoId)
    ON DELETE CASCADE;

CREATE TABLE comments OF comment;
ALTER TABLE comments
    ADD CONSTRAINT comments_pkey
    PRIMARY KEY (commentId);
ALTER TABLE comments
    ADD CONSTRAINT comments_fkey
    FOREIGN KEY (videoId)
    REFERENCES videos(videoId)
    ON DELETE CASCADE;

CREATE TABLE videoValues OF values_matrix;
ALTER TABLE videoValues
    ADD CONSTRAINT videoValues_fkey
    FOREIGN KEY (videoId)
    REFERENCES videos(videoId)
    ON DELETE CASCADE;

COMMIT;
