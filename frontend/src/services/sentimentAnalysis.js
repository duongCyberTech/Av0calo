import axios from 'axios'

export const fetchAnalysis = async (payload) => {
    try {
        return await axios.post(
            "http://127.0.0.1:5000/analyze",
            payload
        )
    } catch (error) {
        throw new Error(error.message)
    }
}