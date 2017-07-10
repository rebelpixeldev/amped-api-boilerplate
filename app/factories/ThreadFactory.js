class ThreadFactory{

	static commentsToCommentCount(dataArr){
		return dataArr.reduce(( ret, d ) => {

			if ( typeof d.threadcomments === 'undefined' )
				return ret;

			const comments = d.threadcomments;

			d.comment_count = comments.length;

			delete d.threadcomments;
			return [...ret, d];
		}, [])
	}

	static isFavorite(dataArr){
		return dataArr.reduce(( ret, d ) => {
			d.is_favorite = typeof d.threadfavorite !== 'undefined' && d.threadfavorite !== null && typeof d.threadfavorite.id !== 'undefined' ? d.threadfavorite.id : false;
			delete d.threadfavorite;
		    return [...ret, d];
		}, [])
	}

}

module.exports = ThreadFactory;