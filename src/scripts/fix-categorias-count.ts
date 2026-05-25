import { db } from '../lib/firebase';

async function fixCounts() {
    const categorias = await db.collection('categorias').get();
    
    for (const cat of categorias.docs) {
        const recetas = await db.collection('recetas')
            .where('categoriaId', '==', cat.id)
            .count()
            .get();
        
        const total = recetas.data().count;
        await db.collection('categorias').doc(cat.id).update({ totalRecetas: total });
        console.log(`${cat.id}: ${total} recetas`);
    }
    
    console.log('Listo');
    process.exit(0);
}

fixCounts();