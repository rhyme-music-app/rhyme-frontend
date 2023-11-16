import React from "react";
import API_URL from "@/configs/apiUrl";
import axios from "axios";
import AppLayout from "@/layouts/appLayout";
import { SongProps } from "@/interfaces/Song";
import ListItem from "@/components/ListItem";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
    deletePlaylist,
    playPause,
    setActiveSong,
    toggleModel,
} from "@/stores/player/currentAudioPlayer";
import ErrorComponent from "@/components/error";
import { shadeColor } from "@/configs/utils";
import CustomImage from "@/components/CustomImage";
import NavBar from "@/components/backButton";

function Playlist({
    data,
    songs,
    success,
}: {
    success: boolean;
    data: any;
    songs: SongProps[];
}) {
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const { isPlaying, playingPlaylist, playlists } = useSelector(
        (state: any) => state.player
    );
    const { user } = useSelector((state: any) => state.auth);
    const [srcollPosition, setScrollPosition] = useState(0);

    const [isScrolling, setScrolling] = useState(false);
    const dropdown = useRef(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!showDropdown) {
            return;
        }

        function handleClick(event: any) {
            // @ts-ignore-comment
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [showDropdown]);

    const onScroll = (e: any) => {
        setScrolling(true);
        setScrollPosition(e.target.scrollTop);
    };

    useEffect(() => {
        if (isScrolling) {
            setShowDropdown(false);
        }
    }, [isScrolling]);

    setTimeout(() => {
        setScrolling(false);
    }, 100);

    const [playlistName, setPlaylistName] = useState(data.name);

    useEffect(() => {
        const renamedPlaylistName = playlists.find((e: any) => e.id == data.id);

        if (renamedPlaylistName) {
            setPlaylistName(renamedPlaylistName.name);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [playlists]);

    if (!success) {
        return (
            <AppLayout>
                <ErrorComponent />
            </AppLayout>
        );
    }

    return (
        <AppLayout title={data.name} color={data.color} onScroll={onScroll}>
            <NavBar
                condition={srcollPosition >= 300}
                color={data.color}
                title={data.name}
            />

            <div
                style={{ backgroundColor: shadeColor(data.color, -30) }}
                className=" h-[360px] pt-16 px-8 bg-gradient-to-t from-[#12121250]
       flex items-center mobile:flex-col mobile:h-full 
       tablet:flex-col tablet:h-full mobile:pt-12 tablet:pt-14
       tablet:text-center tablet:pb-3 mobile:pb-3 mobile:text-center"
            >
                <h1 className="text-[30px] font-ProximaBold  leading-[5rem] mobile:block tablet:block hidden">
                    {playlistName}
                </h1>
                <div
                    style={{
                        backgroundColor: data.color
                            ? shadeColor(data.color, -30)
                            : "#121212",
                    }}
                    className="rounded mr-6 tablet:mr-0 w-[230px] min-w-[230px] h-[230px] mobile:mr-0 relative"
                >
                    <CustomImage
                        src={
                            data.cover_image +
                            "&auto=format&fit=crop&w=400&q=50&h=400"
                        }
                    />
                </div>
                <div>
                    <p className="uppercase font-ProximaBold text-sm tablet:hidden mobile:hidden">
                        Playlist
                    </p>
                    <h1
                        className="text-[70px] font-ProximaBold  leading-[5rem] 
          mini-laptop:text-[65px] tablet:hidden mobile:hidden line-clamp-2"
                    >
                        {playlistName}
                    </h1>
                    <p className="font-ProximaBold text-sm mt-6 tablet:mt-4 opacity-70">
                        {songs.length} Songs
                    </p>
                </div>
            </div>
            <div
                className="pt-6 px-6 tablet:px-6 mobile:px-5 min-h-[1000px]"
                style={{
                    background: `linear-gradient(180deg, ${
                        data.color ? shadeColor(data.color, -60) : "#121212"
                    } 0%, rgba(18,18,18,1) 15%)`,
                }}
            >
                <div className="px-6 mobile:px-1">
                    <div className="w-full flex items-center mb-2">
                        <div
                            onClick={() => {
                                if (playingPlaylist !== data.id) {
                                    dispatch(
                                        setActiveSong({
                                            songs: songs,
                                            index: 0,
                                            playlist: data.id,
                                        })
                                    );
                                } else {
                                    dispatch(playPause(!isPlaying));
                                }
                            }}
                            className="bg-[#2bb540] rounded-full cursor-pointer hover:scale-110
                     w-[45px] h-[45px] flex justify-center items-center"
                        >
                            {playingPlaylist !== data.id ? (
                                <i className="icon-play text-[20px] ml-1 text-black " />
                            ) : !isPlaying ? (
                                <i className="icon-play text-[20px] ml-1 text-black" />
                            ) : (
                                <i className="icon-pause text-[20px] text-black" />
                            )}
                        </div>
                        <div className="relative">
                            <i
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDropdown(!showDropdown);
                                }}
                                className="cursor-pointer mx-4 icon-more-horizontal text-[30px]
               text-slate-400 hover:text-white "
                            ></i>
                            {showDropdown && (
                                <div
                                    ref={dropdown}
                                    className="w-52 bg-[#212121] absolute  rounded shadow 
             left-2 top-10 z-40"
                                >
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(
                                                toggleModel({
                                                    data: true,
                                                    song_id: "RENAME",
                                                    playlist_name: data.name,
                                                    playlist_id: data.id,
                                                })
                                            );
                                            setShowDropdown(false);
                                        }}
                                        className="px-4 rounded py-1.5 hover:bg-[#323232] border-b border-b-[#3e3e3e]"
                                    >
                                        Rename Playlist
                                    </div>
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            dispatch(
                                                deletePlaylist({
                                                    token: user.token,
                                                    playlist_id: data.id,
                                                })
                                            );
                                            setShowDropdown(false);
                                            router.replace("/library");
                                        }}
                                        className="px-4 rounded py-1.5 hover:bg-[#323232] border-b border-b-[#3e3e3e]"
                                    >
                                        Delete Playlist
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="pt-4">
                    {songs.map((song: SongProps, i: number) => (
                        <ListItem
                            isScrolling={isScrolling}
                            key={song.id}
                            song={song}
                            showNumber={i + 1}
                            playlist={data.id}
                            onTap={() => {
                                dispatch(
                                    setActiveSong({
                                        songs: songs,
                                        index: songs.indexOf(song),
                                        playlist: data.id,
                                    })
                                );
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="pb-32"></div>
        </AppLayout>
    );
}

export async function getServerSideProps(context: any) {
    const userCookie = context.req.cookies.user;

    if (!userCookie) {
        return {
            redirect: {
                destination: `/login`,
                permanent: false,
            },
        };
    }

    try {
        const user = JSON.parse(userCookie);

        const playlist = await axios.get(
            `${API_URL}/playlists/${context.params.id}`,
            {
                headers: {
                    authorization: "Bearer " + user.token,
                },
            }
        );

        const songs = await axios.get(
            `${API_URL}/playlists/${context.params.id}/songs`,
            {
                headers: {
                    authorization: "Bearer " + user.token,
                },
            }
        );
        console.log(`${API_URL}/playlists/${context.params.id}/songs`);
        console.log(songs);

        return {
            props: {
                success: true,
                data: playlist.data,
                songs: songs.data.list,
            },
        };

    } catch (e) {
        return {
            props: {
                success: false,
            },
        };
    }
}

export default Playlist;