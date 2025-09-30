
// Animation d'entrée pour les éléments
document.addEventListener('DOMContentLoaded', function() {
    const textarea = document.getElementById('main_container_input');
    const button = document.getElementById('input_btn');
    
    // Effet de focus sur le textarea
    textarea.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    textarea.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
    
    // Animation du bouton
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(10deg)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});