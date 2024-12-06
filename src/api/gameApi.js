import api from "./api";


//Create a game session as a leader
export const createGame = async (name, gameId, calories, timer) => {
    //params - I definitely should reconsider making gameID in the backend for next version
    const data = {
        name: name,
        gameId: gameId,
        calories: calories,
        timer: timer
    }

    try {
        const response = await api.post('/createGame', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}

//Join a game
export const joinGame = async (name, gameId) => {
    //params
    const data = {
        name: name,
        gameId: gameId
    }

    try {
        const response = await api.post('/joinGame', data, {

        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}

//Leave a game
export const leaveGame = async (player, gameId) => {

    //params
    const data = {
        player: player,
        game_id: gameId
    }

    try {
        const response = await api.post('/leaveGame', data, {

        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}

//Start a game
export const startGame = async (gameId) => {
    //params
    const data = {
        game_id: gameId
    }

    try {
        const response = await api.post('/startGame', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}

//Submit scores
export const submitScore = async (playerId, gameId, selectedItems) => {
    //params
    const data = {
        player_id: playerId,
        game_id: gameId,
        selected_items: selectedItems
    }

    try {
        const response = await api.post('/submitScore', data, {

        });

        return response.data;

    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}

//End a game (archive it basically)
//This may not be needed since I have arranged a trigger to auto end a game once a winner is generated
export const endGame = async (gameId) => {
    //params
    const data = {
        game_id: gameId,
    }

    try {
        const response = await api.post('/endGame', data, {

        });

        return response.data;

    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}


//Rematch - ONLY LEADERS CAN DO THIS.
export const rematch = async (gameId) => {
    //params
    const data = {
        gameId: gameId
    }

    try {
        const response = await api.post('/rematch', data, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error || "An unexpected error occurred.");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            // General errors
            throw new Error(error.message);
        }
    }
}







