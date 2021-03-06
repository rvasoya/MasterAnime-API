import chai = require('chai');
import 'mocha';
import { Filter, MasterAnimeAPI } from '../lib';

import validUrl = require('valid-url');

const should = chai.should();

function checkAnimeBasic(animeBasic) {
    animeBasic.should.have.property('title').that.is.a('string');
    animeBasic.should.have.property('slug').that.is.a('string');
}

function checkAnime(anime) {
    anime.should.have.property('id').that.is.a('number');
    checkAnimeBasic(anime);
    anime.should.have.property('status').that.is.a('number');
    anime.should.have.property('type').that.is.a('number');
    anime.should.have.property('score').that.is.a('number');
    anime.should.have.property('episode_count').that.satisfies(e => typeof e === 'number' || e === null);
    anime.should.have.property('started_airing_date').that.is.a('string');
    anime.should.have.property('finished_airing_date').that.satisfies(e => typeof e === 'string' || e === null);
}

function checkAnimeDetailed(animeDetailed) {
    animeDetailed.should.have.property('info').that.is.an('object');
    checkAnimeInfo(animeDetailed.info);
    animeDetailed.should.have.property('synonyms').that.is.an('array');
    animeDetailed.synonyms.forEach(checkSynonym);
    animeDetailed.should.have.property('genres').that.is.an('array');
    animeDetailed.genres.forEach(checkGenre);
    animeDetailed.should.have.property('poster').that.is.a('string');
    animeDetailed.should.have.property('franchise_count').that.is.a('number');
    animeDetailed.should.have.property('wallpapers').that.is.an('array');
    animeDetailed.wallpapers.forEach(checkWallpaper);
    animeDetailed.should.have.property('episodes').that.is.an('array');
    animeDetailed.episodes.forEach(checkEpisode);
}

function checkAnimeInfo(animeInfo) {
    animeInfo.should.have.property('id').that.is.a('number');
    checkAnimeBasic(animeInfo);
    animeInfo.should.have.property('synopsis').that.is.a('string');
    animeInfo.should.have.property('status').that.is.a('number');
    animeInfo.should.have.property('type').that.is.a('number');
    animeInfo.should.have.property('score').that.is.a('number');
    animeInfo.should.have.property('users_watching').that.is.a('number');
    animeInfo.should.have.property('users_completed').that.is.a('number');
    animeInfo.should.have.property('users_on_hold').that.is.a('number');
    animeInfo.should.have.property('users_planned').that.is.a('number');
    animeInfo.should.have.property('users_dropped').that.is.a('number');
    animeInfo.should.have.property('episode_count').that.satisfies(e => typeof e === 'number' || e === null);
    animeInfo.should.have.property('started_airing_date').that.is.a('string');
    animeInfo.should.have.property('finished_airing_date').that.satisfies(e => typeof e === 'string' || e === null);
    animeInfo.should.have.property('youtube_trailer_id').that.satisfies(e => typeof e === 'string' || e === null);
    animeInfo.should.have.property('age_rating').that.is.a('string');
    animeInfo.should.have.property('episode_length').that.is.a('number');
    animeInfo.should.have.property('tvdb_id').that.satisfies(e => typeof e === 'number' || e === null);
    animeInfo.should.have.property('tvdb_season_id').that.satisfies(e => typeof e === 'number' || e === null);
    animeInfo.should.have.property('tvdb_episode').that.is.a('null');
    animeInfo.should.have.property('wallpaper_id').that.satisfies(e => typeof e === 'string' || e === null);
    animeInfo.should.have.property('wallpaper_offset').that.is.a('number');
    animeInfo.should.have.property('franchise_count').that.is.a('number');
}

function checkSynonym(synonym) {
    synonym.should.have.property('title').that.is.a('string');
    synonym.should.have.property('type').that.is.a('number');
}

function checkGenre(genre) {
    genre.should.have.property('id').that.is.a('number');
    genre.should.have.property('name').that.is.a('string');
}

function checkWallpaper(wallpaper) {
    wallpaper.should.have.property('id').that.is.a('string');
    wallpaper.should.have.property('file').that.is.a('string');
}

function checkEpisode(episode) {
    episode.should.have.property('info').that.is.a('object');
    checkEpisodeInfo(episode.info);
    episode.should.have.property('thumbnail').that.is.a('string');
}

function checkEpisodeInfo(episodeInfo) {
    episodeInfo.should.have.property('id').that.is.a('number');
    episodeInfo.should.have.property('anime_id').that.is.a('number');
    episodeInfo.should.have.property('episode').that.is.a('string');
    episodeInfo.should.have.property('title').that.satisfies(e => typeof e === 'string' || e === null);
    episodeInfo.should.have.property('tvdb_id').that.is.satisfies(e => typeof e === 'number' || e === null);
    episodeInfo.should.have.property('aired').that.satisfies(e => typeof e === 'string' || e === null);
    episodeInfo.should.have.property('type').that.is.a('number');
    episodeInfo.should.have.property('duration').that.satisfies(e => typeof e === 'number' || e === null);
    episodeInfo.should.have.property('description').that.satisfies(e => typeof e === 'string' || e === null);
}

function checkTrending(trending) {
    trending.should.have.property('being_watched').that.is.an('array');
    trending.being_watched.forEach(checkTrendingAnime);
    trending.should.have.property('popular_today').that.is.an('array');
    trending.popular_today.forEach(checkTrendingAnime);
}

function checkTrendingAnime(trendingAnime) {
    checkAnimeBasic(trendingAnime);
    trendingAnime.should.have.property('total').that.is.a('number');
    trendingAnime.should.have.property('poster').that.is.a('string');
}

function checkRelease(release) {
    release.should.have.property('anime').that.is.an('object');
    checkAnimeRelease(release.anime);
    release.should.have.property('episode').that.is.a('string');
    release.should.have.property('created_at').that.is.a('string');
}

function checkAnimeRelease(animeRelease) {
    animeRelease.should.have.property('id').that.is.a('number');
    checkAnimeBasic(animeRelease);
    animeRelease.should.have.property('duration').that.satisfies(e => typeof e === 'number' || e === null);
    animeRelease.should.have.property('age').that.is.a('string');
    animeRelease.should.have.property('poster').that.is.a('string');
    animeRelease.should.have.property('wallpaper').that.satisfies(e => typeof e === 'string' || e === null);
}

function checkFilterListing(filterListing) {
    filterListing.should.have.property('total').that.is.a('number');
    filterListing.should.have.property('per_page').that.is.a('number');
    filterListing.should.have.property('current_page').that.is.a('number');
    filterListing.should.have.property('last_page').that.is.a('number');
    filterListing.should.have.property('next_page_url').satisfies(e => typeof e === 'string' || e === null);
    filterListing.should.have.property('prev_page_url').that.satisfies(e => typeof e === 'string' || e === null);
    filterListing.should.have.property('from').that.is.a('number');
    filterListing.should.have.property('to').that.is.a('number');
    filterListing.should.have.property('data').that.is.an('array');
    filterListing.data.forEach(checkFilterResult);
}

function checkFilterResult(filterResult) {
    filterResult.should.have.property('id').that.is.a('number');
    checkAnimeBasic(filterResult);
    filterResult.should.have.property('status').that.is.a('number');
    filterResult.should.have.property('score').that.is.a('number');
    filterResult.should.have.property('episode_count').that.satisfies(e => typeof e === 'number' || e === null);
    filterResult.should.have.property('started_airing_date').that.is.a('string');
    filterResult.should.have.property('finished_airing_date').that.satisfies(e => typeof e === 'string' || e === null);
    filterResult.should.have.property('genres').that.is.an('array');
    filterResult.genres.forEach(checkGenre);
    filterResult.should.have.property('poster').that.is.an('object');
    checkPosterInfo(filterResult.poster);
}

function checkPosterInfo(posterInfo) {
    posterInfo.should.have.property('id').that.is.a('string');
    posterInfo.should.have.property('path').that.is.a('string');
    posterInfo.should.have.property('extension').that.is.a('string');
    posterInfo.should.have.property('file').that.is.a('string');
}

describe('MasterAnimeAPI', () => {
    beforeEach(() => new Promise(resolve => setTimeout(resolve, 5000)));
    describe('#getAnime()', async () => {
        const get = () => MasterAnimeAPI.getAnime(1);
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it('should return an Anime object', async () => {
            const anime = await get();
            should.exist(anime);
            checkAnime(anime);
            return;
        });
    });
    describe('#getAnimeDetailed()', async () => {
        const get = () => MasterAnimeAPI.getAnimeDetailed(1);
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return an AnimeDetailed object'), async () => {
            const anime = await get();
            should.exist(anime);
            checkAnimeDetailed(anime);
            return;
        });
    });
    describe('#getEpisode()', async () => {
        const get = () => MasterAnimeAPI.getEpisode(1, 1);
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return an Episode object'), async () => {
            const episode = await get();
            should.exist(episode);
            checkEpisode(episode);
            return;
        });
    });
    describe('#getEpisodeUrl()', async () => {
        const get = () => MasterAnimeAPI.getEpisodeUrl(1, 1);
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return a valid url'), async () => {
            const url = await get();
            should.exist(url);
            url.should.be.a('string');
            validUrl.isUri(url).should.not.be.undefined;
            return;
        });
    });
    describe('#getTrending()', async () => {
        const get = () => MasterAnimeAPI.getTrending();
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return a Trending object'), async () => {
            const trending = await get();
            should.exist(trending);
            checkTrending(trending);
            return;
        });
    });
    describe('#getReleases()', async () => {
        const get = () => MasterAnimeAPI.getReleases();
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return an array of Release objects'), async () => {
            const releases = await get();
            should.exist(releases);
            (releases as any).should.be.an('array');
            releases.forEach(checkRelease);
            return;
        });
    });
    describe('#getFiltering()', async () => {
        const get = () => MasterAnimeAPI.getFiltering(new Filter());
        it('should return a promise', () => {
            get().should.be.instanceof(Promise);
        });
        it(('should return a FilterListing object'), async () => {
            const filterListing = await get();
            should.exist(filterListing);
            checkFilterListing(filterListing);
            return;
        });
    });
});
