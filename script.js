// 初始化粒子背景
particlesJS('particles', {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 800 } },
    color: { value: "#ffffff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: false },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 6,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out",
      bounce: false
    }
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true
    }
  },
  retina_detect: true
});

// 创建GSAP动画时间轴
const tl = gsap.timeline({ defaults: { duration: 1, ease: "power2.out" } });
tl.from(".floating-nav", { x: 100, opacity: 0 })
  .from(".profile-card", { rotationY: -180, opacity: 0 }, "-=0.5")
  .from(".skills-grid", { y: 100, opacity: 0 }, "+=0.2")
  .from(".gallery-container", { scale: 0.8, opacity: 0 }, "-=0.3");

// 视差滚动效果
window.addEventListener('scroll', () => {
  gsap.to('.parallax-container section', {
    y: (i, target) => -window.scrollY * 0.3 * (i + 1),
    ease: "none"
  });
});

// 动态生成技能卡片
const skills = [
  { icon: 'fa-react', name: 'React框架', level: 95 },
  { icon: 'fa-node', name: 'Node.js', level: 90 },
  { icon: 'fa-database', name: '数据库设计', level: 85 },
  { icon: 'fa-cloud', name: '云架构', level: 92 }
];

const skillsGrid = document.querySelector('.skills-grid');
skills.forEach(skill => {
  const skillCard = document.createElement('div');
  skillCard.className = 'skill-card';
  skillCard.innerHTML = `
    <i class="fab ${skill.icon}"></i>
    <h3>${skill.name}</h3>
    <div class="skill-meter">
      <div class="skill-progress" style="width: ${skill.level}%"></div>
    </div>
  `;
  skillsGrid.appendChild(skillCard);
});

// 卡片翻转交互
document.querySelectorAll('.profile-card').forEach(card => {
  card.addEventListener('click', () => {
    card.querySelector('.card-inner').style.transform = 
      card.querySelector('.card-inner').style.transform.includes('180deg') 
        ? 'rotateY(0deg)' 
        : 'rotateY(180deg)';
  });
});

// 社交媒体按钮悬浮效果
document.querySelectorAll('.social-button').forEach(btn => {
  btn.addEventListener('mouseenter', (e) => {
    gsap.to(e.target, { 
      rotation: 15,
      scale: 1.2,
      duration: 0.3,
      ease: "back.out"
    });
  });
  btn.addEventListener('mouseleave', (e) => {
    gsap.to(e.target, { 
      rotation: 0,
      scale: 1,
      duration: 0.3,
      ease: "back.in"
    });
  });
});

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 移动端导航菜单切换
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('show');
        });
    }

    // 导航栏滚动效果
    const header = document.querySelector('.site-header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });

    // 平滑滚动到锚点
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 关闭移动端导航菜单
                if (mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                }
            }
        });
    });

    // 项目筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前点击的按钮添加active类
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // 联系表单提交
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // 在这里可以添加表单验证
            if (!name || !email || !subject || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 模拟表单提交
            alert('感谢您的留言！我会尽快回复您。');
            
            // 清空表单
            contactForm.reset();
        });
    }

    // 滚动动画
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.section-header, .skill-item, .project-card, .blog-card, .info-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight * 0.9) {
                element.classList.add('animate');
            }
        });
    };
    
    // 初始检查
    animateOnScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', animateOnScroll);

    // 当前年份显示
    const yearSpan = document.querySelector('.footer-bottom p');
    if (yearSpan) {
        const currentYear = new Date().getFullYear();
        yearSpan.innerHTML = `&copy; ${currentYear} 程序人生. 保留所有权利.`;
    }
});

// 页面加载完成后显示内容
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});