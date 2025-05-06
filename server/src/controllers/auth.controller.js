import { pool } from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Function to handle user login
export const login = async (req, res) => {
  try {
    const { username, contrasena } = req.body;

    // Validate required fields
    if (!username || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1 OR email = $1',
      [username]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = userResult.rows[0];

    // In a real application, you should use bcrypt.compare
    // but since your DB stores plain passwords, we'll directly compare
    // This should be changed in production
    if (user.contrasena !== contrasena) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Check if user is active
    if (!user.activo) {
      return res.status(401).json({ message: 'Usuario inactivo' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        username: user.username,
        email: user.email
      },
      'your_jwt_secret', // Change this to a real secret key and store in env variables
      { expiresIn: '1d' }
    );

    // Send response
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

// Function to handle user registration
export const register = async (req, res) => {
  try {
    const { 
      nombre, 
      apellido, 
      username, 
      email, 
      contrasena 
    } = req.body;

    // Validate required fields
    if (!nombre || !apellido || !username || !email || !contrasena) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Check if username or email already exists
    const userExists = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario o email ya existe' });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000); // 6-digit code
    
    // Get current year for anio_ingreso
    const currentYear = new Date().getFullYear();

    // Create new user
    const result = await pool.query(
      `INSERT INTO usuarios (
        id, nombre, apellido, username, email, contrasena, 
        reputacion, activo, verificado, cod_verificacion, anio_ingreso
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        uuidv4(), // Generate UUID for id
        nombre,
        apellido,
        username,
        email,
        contrasena, // In production, hash this password with bcrypt
        0, // Initial reputation
        true, // Active by default
        false, // Not verified initially
        verificationCode,
        currentYear
      ]
    );

    const newUser = result.rows[0];

    // In a real application, you would send verification email here
    // with the verification code

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      'your_jwt_secret', // Change this to a real secret key and store in env variables
      { expiresIn: '1d' }
    );

    // Send response
    return res.status(201).json({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      token
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};