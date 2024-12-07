'use client'
import React, { useState, useEffect } from 'react';
import styles from './Test.module.css';

const Test = () => {
    const [weatherData, setWeatherData] = useState([]);

    const fetchWeatherData = async () => {
        try {
            const response = await fetch('http://localhost:3003/dev/api/weather');
            const data = await response.json();
            const weatherArray = Object.entries(data).map(([provider, info]) => ({
                id: provider,
                provider,
                ...info
            }));
            setWeatherData(weatherArray);
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    };

    const togglePin = async (providerId) => {
        try {
            await fetch('http://localhost:3003/dev/api/weather/togglepin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ providerId }),
            });
            setWeatherData(prevData =>
                prevData.map(item =>
                    item.id === providerId ? { ...item, isPinned: !item.isPinned } : item
                )
            );
        } catch (error) {
            console.error('Error toggling pin:', error);
        }
    };

    const sortedWeatherData = [...weatherData].sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
    });

    return (
        <div className={styles.container}>
            <button className={styles.fetchButton} onClick={fetchWeatherData}>
                Fetch Weather Data
            </button>
            {weatherData.length > 0 && (
                <table className={styles.weatherTable}>
                    <thead>
                        <tr>
                            <th>Provider</th>
                            <th>Temperature</th>
                            <th>Humidity</th>
                            <th>Wind Speed</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedWeatherData.map((item) => (
                            <tr key={item.id}>
                                <td>{item.provider}</td>
                                <td>{item.temperature !== undefined ? `${item.temperature}°C` : 'N/A'}</td>
                                <td>{item.humidity !== undefined ? `${item.humidity}%` : 'N/A'}</td>
                                <td>{item.windSpeed !== undefined ? `${item.windSpeed} km/h` : 'N/A'}</td>
                                <td>{item.description || 'N/A'}</td>
                                <td>
                                    <button
                                        className={`${styles.pinButton} ${item.isPinned ? styles.pinned : ''}`}
                                        onClick={() => togglePin(item.id)}
                                    >
                                        {item.isPinned ? 'Unpin' : '📌Pin'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Test;

