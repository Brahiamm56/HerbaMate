const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del producto es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria'],
        enum: ['Mates', 'Termos', 'Bombillas', 'Yerbas', 'Otros'],
        default: 'Mates'
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0, 'El precio no puede ser negativo']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo'],
        default: 0
    },
    activo: {
        type: Boolean,
        default: true
    },
    imagen: {
        type: String,
        required: [true, 'La imagen es obligatoria']
    },
    descripcion: {
        type: String,
        trim: true,
        maxlength: [500, 'La descripción no puede tener más de 500 caracteres']
    },
    promocion: {
        tipo: {
            type: String,
            enum: ['2x1', '20% OFF', '30% OFF', '50% OFF', ''],
            default: ''
        },
        activa: {
            type: Boolean,
            default: false
        }
    },
    destacado: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento de las consultas
productoSchema.index({ categoria: 1, activo: 1 });
productoSchema.index({ nombre: 'text' }); // Para búsquedas de texto

// Método para obtener productos activos
productoSchema.statics.getActivos = function() {
    return this.find({ activo: true }).sort({ createdAt: -1 });
};

// Método para obtener productos por categoría
productoSchema.statics.getPorCategoria = function(categoria) {
    return this.find({ categoria, activo: true }).sort({ createdAt: -1 });
};

// Método para buscar productos
productoSchema.statics.buscar = function(termino) {
    return this.find({
        $and: [
            { activo: true },
            {
                $or: [
                    { nombre: { $regex: termino, $options: 'i' } },
                    { descripcion: { $regex: termino, $options: 'i' } }
                ]
            }
        ]
    }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Producto', productoSchema); 