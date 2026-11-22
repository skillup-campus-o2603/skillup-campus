import aiCover from '../../assets/courses/ai-cover.webp';
import excelCover from '../../assets/courses/excel-cover.webp';
import webCover from '../../assets/courses/web-cover.webp';
import uxuiCover from '../../assets/courses/uxui-cover.webp';

const LOCAL_COVERS = [
    { image: aiCover, variant: 'course-cover-ai', match: (text) => text.includes('inteligencia artificial') || text.includes('automatizacion') },
    { image: excelCover, variant: 'course-cover-data', match: (text) => text.includes('excel') || text.includes('dashboards') },
    { image: webCover, variant: 'course-cover-web', match: (text) => text.includes('desarrollo web') || text.includes('sitio web') },
    { image: uxuiCover, variant: 'course-cover-ux', match: (text) => text.includes('ux/ui') || text.includes('ux') || text.includes('diseno') },
];

function getLocalCover(course) {
    const text = `${course?.title || ''} ${course?.category?.name || ''}`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    return LOCAL_COVERS.find((cover) => cover.match(text)) || null;
}

export default function CourseThumbnail({ course, className = '' }) {
    if (course?.imageUrl) {
        return (
            <div className={`course-thumbnail course-thumbnail-image ${className}`.trim()}>
                <img src={course.imageUrl} alt={`Imagen del curso ${course.title}`} loading="lazy" />
            </div>
        );
    }

    const cover = getLocalCover(course);

    if (!cover) {
        return (
            <div className={`course-thumbnail course-thumbnail-fallback ${className}`.trim()} aria-hidden="true">
                <span>SKILLUP</span>
                <strong>{course?.title?.slice(0, 1)?.toUpperCase() || 'S'}</strong>
            </div>
        );
    }

    return (
        <div className={`course-thumbnail ${cover.variant} ${className}`.trim()} aria-hidden="true">
            <span className="course-thumbnail-kicker">SKILLUP CAMPUS</span>
            <img src={cover.image} alt="" loading="lazy" />
        </div>
    );
}
