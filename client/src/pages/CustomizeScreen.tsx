import Header from "@/component/Header";
import CardContainer from "@/component/UI/CardContainer";
import GameMode from "@/component/UI/GameMode";

function CustomizeScreen() {
	return (
		<CardContainer>
			<Header title="Customize" />
			<GameMode />
		</CardContainer>
	);
}

export default CustomizeScreen;
