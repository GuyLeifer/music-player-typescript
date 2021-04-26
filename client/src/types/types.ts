export interface Song {
    id: number,
    title: string,
    artistId: number,
    albumId: number,
    youtubeLink: string,
    length: string,
    trackNumber?: number,
    lyrics?: string,
    playCount?: number,
    likes?: number,
    createdAt: Date,
    updatedAt: Date
}

export interface Artist {
    id: number,
    name: string,
    coverImg: string,
    likes: number,
    createdAt: Date,
    updatedAt: Date
}

export interface Album {
    id: number,
    name: string,
    artistId: number,
    coverImg: string,
    likes: number,
    createdAt: Date,
    updatedAt: Date
}

export interface Playlist {
    id: number,
    name: string,
    userId: number,
    songs: number[],
    coverImg: string,
    likes: number,
    createdAt: Date,
    updatedAt: Date
}

export interface User {
    id: number,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    songsLiked: number[],
    artistLiked: number[],
    albumLiked: number[],
    playlistLiked: number[],
    createdAt: Date,
    updatedAt: Date
}

export interface FullArtist {
    artist: Artist,
    songs: Song[],
    albums: Album[]
}
export interface FullArtist {
    artist: Artist,
    songs: Song[],
    albums: Album[]
}

export interface FullAlbum {
    album: Album,
    artist: Artist,
    songs: Song[]
}

export interface Songs {
    album: Album,
    artist: Artist,
    songs: Song[]
}