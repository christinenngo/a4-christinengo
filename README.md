Assignment 2 - Short Stack: Basic Two-tier Web Application using HTML/CSS/JS and Node.js  
===

Readme 
---

## Web Application: Watchlistify
Watchlistify is a simple watchlist website that allows users to keep track of shows or movies they have watched or are currently watching. 
It includes the format, title, genre, rating, episodes watched, and total episodes. 
To use the application, just fill out all the information in the form and submit. 
Click on the specific table cell to edit information or click delete to remove an entry.
A CSS grid was used for the page's positioning.

## Technical Achievements
- **Tech Achievement 1**: Created a single-page app where the form and results table are shown on the same page. 
    The displayed data and derived field is also always up-to-date without needing to refresh since the table is updated after each action. 
    The data is kept in the memory until the server is restarted so it doesn't reset with each refresh. 
- **Tech Achievement 2**: Added the ability to modify existing data on the server by allowing the content in each table cell to be editable. 
    It sends a PATCH request to update the data after it detects that the user has clicked off the cell after making an edit. 
    The progress derived field also automatically recalculates and updates.

### Design/Evaluation Achievements
- **Design Achievement 1**: Used a flexbox for the layout of the form so that all the input fields were consistent and aligned.
- **Evaluation 1**:
    1. Last Name: Vu
    2. The edit functionality was not intuitive since there was no indication to click on the cells to edit the data.
    3. They liked the layout of my page and how clean and simple it is.
    4. I would add a note telling the user how to edit the existing data.
- **Evaluation 2**:
    1. Last Name: Quach
    2. They did not know what to put for number of episodes when they were entering a movie.
    3. They found that the cells were editable on their own and commented it was a nice feature.
    4. I would make the fields different depending on the format of what was being added, so episodes for shows and runtime for movies.

