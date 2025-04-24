document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const screens = document.querySelectorAll('.onboarding-screen');
    const nextButtons = document.querySelectorAll('.next-button');
    const backButtons = document.querySelectorAll('.back-button');
    const useCaseOptions = document.querySelectorAll('.use-case-option');
    const useCaseCheckboxes = document.querySelectorAll('.use-case-option input[type="checkbox"]');
    const progressBar = document.getElementById('progress-bar');
    const finishButton = document.getElementById('finish-button');
    const modulesStatus = document.getElementById('modules-status');
    const moduleProgress = document.getElementById('module-progress');
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    const dashboardPreview = document.getElementById('dashboard-preview');
    const setupComplete = document.getElementById('setup-complete');
    const setupStatus = document.getElementById('setup-status');
    const configuringMessage = document.getElementById('configuring-message');
    const statusItems = document.querySelectorAll('.status-item');
    
    // Responsive design helper
    const isMobile = () => window.innerWidth < 640;
    
    // Current screen index
    let currentScreenIndex = 0;
    
    // Touch tracking for swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Configuration messages
    const configMessages = [
        "Deine ausgewählten Module werden installiert",
        "Verbindung zum Backend wird hergestellt",
        "Daten werden synchronisiert",
        "Konfiguration wird optimiert",
        "Fast fertig...",
    ];
    
    // Module progress messages
    const progressMessages = [
        "Wird gestartet...",
        "30% abgeschlossen",
        "65% abgeschlossen",
        "Fast fertig...",
        "Abgeschlossen!"
    ];

    // Add names to choose from and get more creative
    const names = ['Max', 'Sophie', 'Alexander', 'Julia', 'Thomas', 'Laura', 'Lena', 'Felix', 'Emilia', 'Jonas'];
    const randomNameIndex = Math.floor(Math.random() * names.length);
    document.getElementById('user-name').textContent = names[randomNameIndex];
    
    // Update steps indicator
    function updateSteps(currentIndex) {
        steps.forEach((step, index) => {
            if (index < currentIndex) {
                step.classList.remove('active');
                step.classList.add('completed');
            } else if (index === currentIndex) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        stepLines.forEach((line, index) => {
            if (index < currentIndex) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
    }

    // Navigate to next screen with smooth transition
    function goToNextScreen() {
        // Add a quick validation if on screen 2 (Use cases)
        if (currentScreenIndex === 1) {
            const selectedUseCases = document.querySelectorAll('.use-case-option input[type="checkbox"]:checked');
            if (selectedUseCases.length === 0) {
                const warningMessage = document.createElement('div');
                warningMessage.className = 'bg-orange-100 border border-orange-400 text-orange-700 px-4 py-3 rounded relative my-4';
                warningMessage.innerHTML = '<strong class="font-bold">Hinweis:</strong> <span class="block sm:inline">Bitte wähle mindestens einen Use-Case aus.</span>';
                
                // Only add warning if it doesn't exist yet
                if (!document.querySelector('.bg-orange-100')) {
                    const usesCaseContainer = document.querySelector('#screen-use-cases .p-10');
                    usesCaseContainer.insertBefore(warningMessage, usesCaseContainer.querySelector('.flex.justify-between'));
                    
                    // Auto-remove after 3 seconds
                    setTimeout(() => {
                        if (warningMessage.parentNode) {
                            warningMessage.parentNode.removeChild(warningMessage);
                        }
                    }, 3000);
                    
                    return;
                }
            }
        }
        
        screens[currentScreenIndex].classList.remove('active');
        currentScreenIndex = Math.min(currentScreenIndex + 1, screens.length - 1);
        screens[currentScreenIndex].classList.add('active');
        
        // Update steps indicator
        updateSteps(currentScreenIndex);
        
        // If on the final screen, start the progress animation
        if (currentScreenIndex === 2) {
            simulateSetup();
        }
        
        // Scroll to top of screen on mobile
        if (isMobile()) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    
    // Navigate to previous screen
    function goToPreviousScreen() {
        screens[currentScreenIndex].classList.remove('active');
        currentScreenIndex = Math.max(currentScreenIndex - 1, 0);
        screens[currentScreenIndex].classList.add('active');
        
        // Update steps indicator
        updateSteps(currentScreenIndex);
        
        // Scroll to top of screen on mobile
        if (isMobile()) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }
    
    // Handle touch start event
    function handleTouchStart(event) {
        touchStartX = event.touches[0].clientX;
    }
    
    // Handle touch move event
    function handleTouchMove(event) {
        touchEndX = event.touches[0].clientX;
    }
    
    // Handle touch end event
    function handleTouchEnd() {
        // Minimum swipe distance required (in pixels)
        const minSwipeDistance = 50;
        const swipeDistance = touchEndX - touchStartX;
        
        // Require a minimum swipe distance
        if (Math.abs(swipeDistance) < minSwipeDistance) return;
        
        if (swipeDistance > 0) {
            // Swipe right - go to previous screen
            goToPreviousScreen();
        } else {
            // Swipe left - go to next screen
            goToNextScreen();
        }
    }
    
    // Handle use case selection
    function toggleUseCase(event) {
        const option = event.currentTarget;
        const checkbox = option.querySelector('input[type="checkbox"]');
        
        if (checkbox !== event.target) {
            checkbox.checked = !checkbox.checked;
        }
        
        if (checkbox.checked) {
            option.classList.add('selected');
        } else {
            option.classList.remove('selected');
        }
    }
    
    // Cycle through configuration messages for a more dynamic feel
    function cycleConfigMessages() {
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (messageIndex < configMessages.length) {
                configuringMessage.textContent = configMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
            }
        }, 800);
    }
    
    // Cycle through progress messages for module installation
    function cycleProgressMessages() {
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
            if (messageIndex < progressMessages.length) {
                moduleProgress.textContent = progressMessages[messageIndex];
                messageIndex++;
            } else {
                clearInterval(messageInterval);
            }
        }, 1200);
    }
    
    // Adjust UI based on screen size
    function adjustForScreenSize() {
        // You can add specific adjustments based on screen size here
        if (isMobile()) {
            // Mobile-specific adjustments
            document.querySelectorAll('.text-xl').forEach(el => {
                el.classList.remove('text-xl');
                el.classList.add('text-lg');
            });
        } else {
            // Desktop-specific adjustments
            document.querySelectorAll('.text-lg:not(.mb-8)').forEach(el => {
                el.classList.remove('text-lg');
                el.classList.add('text-xl');
            });
        }
    }
    
    // Simulate dashboard setup process
    function simulateSetup() {
        // Start cycling configuration messages
        cycleConfigMessages();
        cycleProgressMessages();
        
        // Initial progress
        progressBar.style.width = '25%';
        
        // Start animation sequence
        setTimeout(() => {
            // Update progress to 50%
            progressBar.style.width = '50%';
            
            // Complete "Module configuration" step
            setTimeout(() => {
                // Update UI for Module completion
                modulesStatus.classList.remove('animate-spin');
                modulesStatus.classList.remove('border-t-transparent', 'border-2');
                modulesStatus.classList.add('bg-blue-500');
                modulesStatus.innerHTML = `<i class="fas fa-check text-white text-sm flex items-center justify-center w-full h-full"></i>`;
                
                // Update module status text
                const moduleStatusText = statusItems[2].querySelector('.text-slate-700.font-medium');
                moduleStatusText.textContent = 'Module konfiguriert';
                
                const moduleProgressText = statusItems[2].querySelector('.status-progress');
                moduleProgressText.innerHTML = '<span class="text-green-500"><i class="fas fa-check"></i></span>';
                
                // Highlight with animation
                statusItems[2].classList.add('setup-complete');
                
                // Update progress to 75%
                progressBar.style.width = '75%';
                
                // Show dashboard preview
                dashboardPreview.classList.remove('hidden');
                dashboardPreview.classList.add('fadeInUp');
                
                // Start working on final step
                setTimeout(() => {
                    const finalStep = statusItems[3];
                    finalStep.classList.remove('text-slate-400');
                    
                    // Update status icon
                    const finalStepIcon = finalStep.querySelector('.w-8.h-8');
                    finalStepIcon.classList.remove('border-slate-300', 'border-2');
                    finalStepIcon.classList.add('border-blue-500', 'border-2', 'border-t-transparent', 'animate-spin');
                    finalStepIcon.innerHTML = '';
                    
                    // Update status text
                    const finalStepText = finalStep.querySelector('.font-medium');
                    finalStepText.textContent = 'Dashboard wird vorbereitet...';
                    finalStepText.classList.add('text-slate-700');
                    
                    const finalStepStatus = finalStep.querySelector('.text-slate-300');
                    finalStepStatus.innerHTML = '<span class="text-blue-500">Wird geladen...</span>';
                    
                    // Complete final step
                    setTimeout(() => {
                        progressBar.style.width = '100%';
                        
                        // Update status icon to completed
                        finalStepIcon.classList.remove('animate-spin', 'border-t-transparent', 'border-2', 'border-blue-500');
                        finalStepIcon.classList.add('bg-blue-500');
                        finalStepIcon.innerHTML = `<i class="fas fa-check text-white text-sm flex items-center justify-center w-full h-full"></i>`;
                        
                        // Update status text
                        finalStepText.textContent = 'Dashboard bereit';
                        
                        // Update status indicator
                        finalStepStatus.innerHTML = '<span class="text-green-500"><i class="fas fa-check"></i></span>';
                        
                        // Highlight with animation
                        finalStep.classList.add('setup-complete');
                        
                        // Show setup complete
                        setTimeout(() => {
                            setupStatus.classList.add('hidden');
                            setupComplete.classList.remove('hidden');
                            
                            // Enable finish button
                            finishButton.classList.remove('opacity-50', 'cursor-not-allowed', 'bg-slate-400');
                            finishButton.classList.add('bg-gradient-to-r', 'from-green-500', 'to-green-600', 'hover:from-green-600', 'hover:to-green-700', 'shadow-lg', 'hover:shadow-xl');
                        }, 800);
                    }, 1500);
                }, 1200);
            }, 1800);
        }, 1200);
    }
    
    // Confirm exit with unsaved changes
    function confirmExit(e) {
        // Only show confirmation if we're in the middle of the flow
        if (currentScreenIndex > 0) {
            const confirmationMessage = 'Der Onboarding-Prozess ist noch nicht abgeschlossen. Möchtest du wirklich die Seite verlassen?';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    }
    
    // Create confetti effect
    function createConfetti() {
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'fixed inset-0 pointer-events-none z-40';
        document.body.appendChild(confettiContainer);
        
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];
        // Reduce confetti count on mobile for better performance
        const confettiCount = isMobile() ? 100 : 200;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'absolute';
            confetti.style.width = `${Math.random() * 10 + 5}px`;
            confetti.style.height = `${Math.random() * 5 + 3}px`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.top = '-20px';
            confetti.style.borderRadius = '2px';
            confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            confettiContainer.appendChild(confetti);
        }
        
        // Add keyframes for the fall animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fall {
                to {
                    transform: translateY(100vh) rotate(${Math.random() * 360 + 360}deg);
                    opacity: 0;
                }
            }
            
            @keyframes fadeOut {
                to {
                    opacity: 0;
                }
            }
            
            .fadeOut {
                animation: fadeOut 0.3s ease forwards;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .fadeInUp {
                animation: fadeInUp 0.4s ease forwards;
            }
        `;
        document.head.appendChild(style);
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confettiContainer.remove();
        }, 5000);
    }
    
    // Event listeners for buttons
    nextButtons.forEach(button => {
        button.addEventListener('click', goToNextScreen);
    });
    
    backButtons.forEach(button => {
        button.addEventListener('click', goToPreviousScreen);
    });
    
    // Event listeners for touch events on main container
    const onboardingFlow = document.getElementById('onboarding-flow');
    onboardingFlow.addEventListener('touchstart', handleTouchStart, false);
    onboardingFlow.addEventListener('touchmove', handleTouchMove, false);
    onboardingFlow.addEventListener('touchend', handleTouchEnd, false);
    
    useCaseOptions.forEach(option => {
        option.addEventListener('click', toggleUseCase);
    });
    
    finishButton.addEventListener('click', () => {
        if (!finishButton.classList.contains('opacity-50')) {
            // Create confetti effect
            createConfetti();
            
            // Show completion modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 sm:p-8 max-w-md mx-4 shadow-2xl transform transition-all">
                    <div class="text-center">
                        <div class="w-14 h-14 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check text-white text-xl sm:text-2xl"></i>
                        </div>
                        <h3 class="text-xl sm:text-2xl font-bold mb-2">Herzlichen Glückwunsch!</h3>
                        <p class="text-gray-600 mb-6 text-sm sm:text-base">Dein Dashboard ist fertig eingerichtet und kann jetzt genutzt werden.</p>
                        <button class="start-dashboard-btn bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-all shadow-lg hover:shadow-xl w-full sm:w-auto">
                            Zum Dashboard
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listener to the button in the modal
            document.querySelector('.start-dashboard-btn').addEventListener('click', () => {
                modal.classList.add('fadeOut');
                setTimeout(() => {
                    document.body.removeChild(modal);
                    alert('In einer echten Anwendung würdest du jetzt zu deinem Dashboard weitergeleitet.');
                }, 300);
            });
        }
    });
    
    // Event listener for window resize
    window.addEventListener('resize', adjustForScreenSize);
    
    // Event listener for page unload
    window.addEventListener('beforeunload', confirmExit);
    
    // Initialize steps and adjust UI for current screen size
    updateSteps(currentScreenIndex);
    adjustForScreenSize();
}); 