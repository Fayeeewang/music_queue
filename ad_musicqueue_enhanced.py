# Enhanced version based on the original music queue lab
# Keeps Song + DLinkedList as the core structure, but adds product-style functions.
from ytmusicapi import YTMusic
from structures_enhanced import DLinkedList, Song, time_to_seconds, seconds_to_time_format
import os

NO_OF_RESULTS = 5

def clear():
    if os.name == "posix":
        os.system("clear")
    else:
        os.system("cls")

def extract_artists(song):
    artists = song.get("artists") or []
    if len(artists) == 0:
        return "Unknown Artist"

    artist_list = []
    for artist in artists:
        artist_list.append(artist.get("name", "Unknown Artist"))

    return ", ".join(artist_list)

def song_search(query):
    ytmusic = YTMusic()
    results = ytmusic.search(query)
    return results[:NO_OF_RESULTS]

def filter_info(results):
    songs = []
    for result in results:
        try:
            name = result.get("title", "Unknown Title")
            artist = extract_artists(result)
            duration_str = result.get("duration") or "0:00"
            duration = time_to_seconds(duration_str)
            songs.append(Song(name, artist, duration))
        except Exception:
            continue

    return songs

def print_song_results(results):
    if len(results) == 0:
        print("No songs found.")
        return
    assert type(results[0]) == Song, "The list to be printed doesn't have the items of type 'Song'"
    print("RESULTS:")
    for i in range(len(results)):
        print(f"{i + 1}. {results[i]}")

def search():
    while True:
        try:
            query = input("Search: ")
            results = song_search(query)
            songs = filter_info(results)
            clear()
            print_song_results(songs)

            if len(songs) == 0:
                print("\nChoose one of the following options:")
                print("                Enter '0' to search again")
                print("                Enter 'q' to go back")
                choice = input(">> ")

                while choice not in ["0", "q"]:
                    print("Invalid input.")
                    choice = input(">> ")

                if choice == "q":
                    return None
                continue

            print("\nChoose one of the following options:")
            print(f"                Enter a number (1-{len(songs)}) to add a song")
            print("                Enter '0' to search again")
            print("                Enter 'q' to go back")
            choice = input(">> ")

            valid_choices = ["0", "q"]
            for i in range(len(songs)):
                valid_choices.append(str(i + 1))

            while choice not in valid_choices:
                print("Invalid input.")
                choice = input(">> ")

            if choice == "q":
                return None
            if choice == "0":
                continue
            return songs[int(choice) - 1]

        except Exception as e:
            print(f"Error: {e}")
            return None

def print_status(queue):
    print("Currently playing:")
    if not queue.is_empty():
        current = queue.get_current()
        print(f"   {current.get_name()} — {current.get_artist()}")
        print(f"   Queue length: {seconds_to_time_format(queue.get_total_duration())}")
        print(f"   Remaining: {seconds_to_time_format(queue.get_remaining_duration())}")
        if queue.get_repeat_mode():
            print("   Repeat all: On\n")
        else:
            print("   Repeat all: Off\n")
    else:
        print("   None\n")

def show_matches(matches):
    if len(matches) == 0:
        print("No matching songs found.")
    else:
        print("Matches:")
        for position, song in matches:
            print(f"{position}. {song.get_name()} — {song.get_artist()}")

def main():
    queue = DLinkedList()

    choice_str = """Choose one of the following options:
                \t1. Add Song
                \t2. Next Song
                \t3. Previous Song
                \t4. Remove Current Song
                \t5. Show Queue
                \t6. Clear Queue
                \t7. Quit
                \t8. Search Queue
                \t9. Jump to Song
                \t10. Show Remaining Time
                \t11. Move Current Song to End
                \t12. Toggle Repeat All
                Enter the choice (eg: 2)
                """

    clear()
    print("WELCOME\n")

    while True:
        print_status(queue)
        print(choice_str)
        choice = input(">> ")

        while choice not in ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]:
            print("Invalid Input.")
            choice = input(">> ")

        if choice == "1":
            song = search()
            if song is not None:
                if queue.is_empty():
                    queue.add_last(song)
                else:
                    place = input("Where would you like to add the song:\n\t1. Add Next\n\t2. Add to the End\n>> ")
                    while place not in ["1", "2"]:
                        print("Invalid Input.")
                        place = input(">> ")
                    if place == "1":
                        queue.add_next(song)
                    else:
                        queue.add_last(song)
                print("Song added successfully!")
                input("\nPress enter key to continue...")

        elif choice == "2":
            clear()
            if not queue.is_empty():
                queue.play_next()
                print(f"Now Playing: '{queue.get_current().get_name()}'")
            else:
                print("Now Playing: None")
            input("\nPress enter key to continue...")

        elif choice == "3":
            clear()
            if not queue.is_empty():
                queue.play_previous()
                print(f"Now Playing: '{queue.get_current().get_name()}'")
            else:
                print("Now Playing: None")
            input("\nPress enter key to continue...")

        elif choice == "4":
            clear()
            if not queue.is_empty():
                removed_song = queue.remove_current()
                print(f"Removed:\n{removed_song}")
            else:
                print("The queue is already empty!")
            input("\nPress enter key to continue...")

        elif choice == "5":
            clear()
            print(queue)
            input("\nPress enter key to continue...")

        elif choice == "6":
            clear()
            queue.clear()
            print("The queue has been cleared!")
            input("\nPress enter key to continue...")

        elif choice == "7":
            break

        elif choice == "8":
            clear()
            keyword = input("Enter a song or artist keyword: ")
            show_matches(queue.search_queue(keyword))
            input("\nPress enter key to continue...")

        elif choice == "9":
            clear()
            try:
                position = int(input("Enter song position: "))
                if queue.jump_to(position):
                    print(f"Jumped to: {queue.get_current().get_name()}")
                else:
                    print("Invalid position.")
            except ValueError:
                print("Please enter a number.")
            input("\nPress enter key to continue...")

        elif choice == "10":
            clear()
            remaining = queue.get_remaining_duration()
            print(f"Remaining time: {seconds_to_time_format(remaining)}")
            input("\nPress enter key to continue...")

        elif choice == "11":
            clear()
            try:
                moved_song = queue.move_current_to_end()
                print(f"Moved to end: {moved_song.get_name()}")
            except Exception as e:
                print(e)
            input("\nPress enter key to continue...")

        elif choice == "12":
            clear()
            queue.toggle_repeat_all()
            if queue.get_repeat_mode():
                print("Repeat all is now: On")
            else:
                print("Repeat all is now: Off")
            input("\nPress enter key to continue...")

        clear()

    print("Thanks for listening!")

if __name__ == "__main__":
    main()
