type CourseProps = {
	title?: string;
	description?: string;
};

const CourseGoal = ({ title, description }: CourseProps) => {
	return (
		<article>
			<div>
				<h2>{title}</h2>
				<p>{description}</p>
				<button>Delete</button>
			</div>
		</article>
	);
};

export default CourseGoal;
