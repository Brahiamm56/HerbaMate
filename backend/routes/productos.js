const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requireAuth } = require('../middleware/auth');
const Producto = require('../models/Producto');
const router = express.Router();

// Configuración de Multer para subida de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        // Crear directorio si no existe
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generar nombre único para la imagen
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'producto-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB máximo
    },
    fileFilter: (req, file, cb) => {
        // Verificar tipo de archivo
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, webp)'));
        }
    }
});

// GET /api/productos - Obtener todos los productos (público)
router.get('/', async (req, res) => {
    try {
        const { categoria, busqueda, destacados } = req.query;
        let productos;
        
        if (busqueda) {
            productos = await Producto.buscar(busqueda);
        } else if (categoria) {
            productos = await Producto.getPorCategoria(categoria);
        } else if (destacados === 'true') {
            productos = await Producto.find({ activo: true, destacado: true }).sort({ createdAt: -1 });
        } else {
            productos = await Producto.getActivos();
        }
        
        res.json({
            success: true,
            data: productos,
            total: productos.length
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener productos'
        });
    }
});

// GET /api/productos/:id - Obtener un producto específico
router.get('/:id', async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener producto'
        });
    }
});

// POST /api/productos - Crear nuevo producto (solo admin)
router.post('/', requireAuth, upload.single('imagen'), async (req, res) => {
    try {
        // Convertir checkboxes a booleanos
        if (typeof req.body.activo !== 'undefined') {
            req.body.activo = req.body.activo === 'on' || req.body.activo === true || req.body.activo === 'true';
        }
        if (typeof req.body.destacado !== 'undefined') {
            req.body.destacado = req.body.destacado === 'on' || req.body.destacado === true || req.body.destacado === 'true';
        }
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'La imagen es obligatoria'
            });
        }
        
        const productoData = {
            ...req.body,
            imagen: `/uploads/${req.file.filename}`
        };
        
        const producto = new Producto(productoData);
        await producto.save();
        
        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        
        // Eliminar imagen si se subió pero falló la creación
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error al crear producto'
        });
    }
});

// PUT /api/productos/:id - Actualizar producto (solo admin)
router.put('/:id', requireAuth, upload.single('imagen'), async (req, res) => {
    try {
        // Convertir checkboxes a booleanos
        if (typeof req.body.activo !== 'undefined') {
            req.body.activo = req.body.activo === 'on' || req.body.activo === true || req.body.activo === 'true';
        }
        if (typeof req.body.destacado !== 'undefined') {
            req.body.destacado = req.body.destacado === 'on' || req.body.destacado === true || req.body.destacado === 'true';
        }
        
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        const updateData = { ...req.body };
        
        // Si se subió una nueva imagen, actualizar y eliminar la anterior
        if (req.file) {
            // Eliminar imagen anterior si existe
            if (producto.imagen) {
                const oldImagePath = path.join(__dirname, '../../', producto.imagen);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.imagen = `/uploads/${req.file.filename}`;
        }
        
        const productoActualizado = await Producto.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        res.json({
            success: true,
            message: 'Producto actualizado exitosamente',
            data: productoActualizado
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        
        // Eliminar imagen si se subió pero falló la actualización
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            success: false,
            error: error.message || 'Error al actualizar producto'
        });
    }
});

// DELETE /api/productos/:id - Eliminar producto (solo admin)
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        // Eliminar imagen del servidor
        if (producto.imagen) {
            const imagePath = path.join(__dirname, '../../', producto.imagen);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await Producto.findByIdAndDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al eliminar producto'
        });
    }
});

// PATCH /api/productos/:id/toggle - Cambiar estado activo/inactivo (solo admin)
router.patch('/:id/toggle', requireAuth, async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        producto.activo = !producto.activo;
        await producto.save();
        
        res.json({
            success: true,
            message: `Producto ${producto.activo ? 'activado' : 'desactivado'} exitosamente`,
            data: producto
        });
    } catch (error) {
        console.error('Error al cambiar estado del producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error al cambiar estado del producto'
        });
    }
});

module.exports = router; 